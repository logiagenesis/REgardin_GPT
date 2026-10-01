import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import {
  validateFields,
  validateFiles,
  takeRateLimit,
  storeEnquiry,
  notifyPending,
  limitedFormData,
  MAX_BODY_BYTES,
} from '../functions/lib/enquiries.js';
import { onRequestGet, onRequestPost } from '../functions/api/enquiries.js';
function database() {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(readFileSync(new URL('../migrations/0001_enquiries.sql', import.meta.url), 'utf8'));
  const wrap = (sql, args = []) => ({
    bind: (...a) => wrap(sql, a),
    first: async () => db.prepare(sql).get(...args) || null,
    run: async () => db.prepare(sql).run(...args),
    all: async () => ({ results: db.prepare(sql).all(...args) }),
    sql,
    args,
  });
  return {
    prepare: wrap,
    batch: async (statements) => {
      db.exec('BEGIN');
      try {
        const result = statements.map((s) => ({ results: db.prepare(s.sql).all(...s.args) }));
        db.exec('COMMIT');
        return result;
      } catch (e) {
        db.exec('ROLLBACK');
        throw e;
      }
    },
    raw: db,
  };
}
function form(overrides = {}) {
  const f = new FormData();
  const values = {
    name: 'Synthetic Test',
    phone: '+27000000000',
    email: 'synthetic@example.com',
    suburb: 'Test location',
    service: 'painting',
    brief: 'Synthetic test enquiry, not a real customer.',
    timing: 'Not specified',
    website: '',
    idempotencyKey: crypto.randomUUID(),
    'cf-turnstile-response': 'test-response',
    ...overrides,
  };
  for (const [key, value] of Object.entries(values)) f.set(key, value);
  return f;
}
function environment() {
  const DB = database();
  const objects = new Map();
  return {
    DB,
    UPLOADS: { put: async (k, v) => objects.set(k, v), delete: async (k) => objects.delete(k) },
    objects,
    TURNSTILE_SECRET: 'synthetic-unit-secret',
    TURNSTILE_SITE_KEY: 'synthetic-unit-site-key',
    EMAIL_API_KEY: 'synthetic-unit-email-key',
    NOTIFICATION_EMAIL: 'owner@example.com',
    FROM_EMAIL: 'Website <website@example.com>',
    PUBLIC_ORIGIN: 'https://example.com',
  };
}
function request(f, options = {}) {
  return new Request('https://example.com/api/enquiries', {
    method: 'POST',
    body: f,
    headers: {
      Origin: 'https://example.com',
      Accept: 'application/json',
      'cf-connecting-ip': '192.0.2.1',
      ...options,
    },
  });
}
test('required fields, service, email and phone are validated', () => {
  const valid = validateFields(form());
  assert.equal(valid.service, 'painting');
  for (const change of [
    { name: '' },
    { email: 'not-email' },
    { phone: 'letters' },
    { service: 'fabricated-service' },
    { brief: 'too short' },
  ])
    assert.throws(() => validateFields(form(change)));
});
test('attachment magic, count and size limits reject invalid uploads', async () => {
  const f = form();
  f.append('photos', new File(['executable payload'], 'bad.jpg', { type: 'image/jpeg' }));
  await assert.rejects(() => validateFiles(f));
  const many = form();
  for (let i = 0; i < 6; i++)
    many.append('photos', new File(['%PDF-1.7\n'], 'plan.pdf', { type: 'application/pdf' }));
  await assert.rejects(() => validateFiles(many));
  const oversize = form();
  oversize.append(
    'photos',
    new File([new Uint8Array(8 * 1024 * 1024 + 1)], 'large.pdf', { type: 'application/pdf' }),
  );
  await assert.rejects(() => validateFiles(oversize));
  const ok = form();
  ok.append('photos', new File(['%PDF-1.7\n'], 'plan.pdf', { type: 'application/pdf' }));
  assert.equal((await validateFiles(ok)).length, 1);
});
test('rate limits reset in next window using real SQL', async () => {
  const db = database();
  for (let i = 0; i < 5; i++) assert.equal(await takeRateLimit(db, 'synthetic', 1000), true);
  assert.equal(await takeRateLimit(db, 'synthetic', 1000), false);
  assert.equal(await takeRateLimit(db, 'synthetic', 601000), true);
});
test('lead and retry outbox stored once with matching idempotency', async () => {
  const env = environment();
  const data = validateFields(form());
  const key = crypto.randomUUID();
  const first = await storeEnquiry(env, data, key, []);
  const second = await storeEnquiry(env, data, key, []);
  assert.equal(first.receipt, second.receipt);
  assert.equal(second.duplicate, true);
  assert.equal(env.DB.raw.prepare('SELECT count(*) AS n FROM enquiries').get().n, 1);
  assert.equal(env.DB.raw.prepare('SELECT count(*) AS n FROM notification_outbox').get().n, 1);
  await assert.rejects(
    () => storeEnquiry(env, { ...data, brief: 'Different synthetic message entirely.' }, key, []),
    (e) => e.status === 409,
  );
});
test('upload failure preserves durable enquiry and reports incomplete', async () => {
  const env = environment();
  env.UPLOADS.put = async () => {
    assert.equal(env.DB.raw.prepare('SELECT count(*) AS n FROM enquiries').get().n, 1);
    throw new Error('Synthetic storage failure');
  };
  const receipt = await storeEnquiry(env, validateFields(form()), crypto.randomUUID(), [
    new File(['%PDF-1.7\n'], 'test.pdf', { type: 'application/pdf' }),
  ]);
  assert.equal(receipt.uploadStatus, 'incomplete');
  assert.equal(
    env.DB.raw.prepare('SELECT upload_status FROM enquiries').get().upload_status,
    'incomplete',
  );
  assert.equal(env.DB.raw.prepare('SELECT count(*) AS n FROM notification_outbox').get().n, 1);
});
test('private upload stored after enquiry and indexed without a public URL', async () => {
  const env = environment();
  const receipt = await storeEnquiry(env, validateFields(form()), crypto.randomUUID(), [
    new File(['%PDF-1.7\n'], 'test.pdf', { type: 'application/pdf' }),
  ]);
  const row = env.DB.raw.prepare('SELECT * FROM attachments').get();
  assert.equal(row.enquiry_id, receipt.receipt);
  assert.equal(env.objects.has(row.storage_key), true);
  assert.ok(!row.storage_key.startsWith('http'));
});
test('notification failure queues retry and successful retry never loses or repeats lead', async () => {
  const env = environment();
  const receipt = await storeEnquiry(env, validateFields(form()), crypto.randomUUID(), []);
  assert.equal(
    await notifyPending(env, receipt.receipt, async () => new Response('', { status: 503 })),
    false,
  );
  assert.equal(env.DB.raw.prepare('SELECT count(*) AS n FROM enquiries').get().n, 1);
  assert.equal(env.DB.raw.prepare('SELECT state FROM notification_outbox').get().state, 'pending');
  let sent = 0;
  const success = async (_url, options) => {
    sent++;
    const body = JSON.parse(options.body);
    assert.equal(body.reply_to, 'synthetic@example.com');
    assert.ok(!body.from.includes('synthetic@example.com'));
    assert.equal(options.headers['Idempotency-Key'], 'regardin-' + receipt.receipt);
    return new Response('{}', { status: 200 });
  };
  assert.equal(await notifyPending(env, receipt.receipt, success), true);
  assert.equal(await notifyPending(env, receipt.receipt, success), false);
  assert.equal(sent, 1);
});
test('configuration absent fails closed without accepting a lead', async () => {
  assert.equal((await onRequestGet({ env: {} }).json()).enabled, false);
  const response = await onRequestPost({ request: request(form()), env: {}, waitUntil: () => {} });
  assert.equal(response.status, 503);
});
test('cross-origin and honeypot enquiries rejected', async () => {
  const env = environment();
  let response = await onRequestPost({
    request: request(form(), { Origin: 'https://other.example' }),
    env,
    waitUntil: () => {},
  });
  assert.equal(response.status, 403);
  response = await onRequestPost({
    request: request(form({ website: 'bot' })),
    env,
    waitUntil: () => {},
  });
  assert.equal(response.status, 400);
  assert.equal(env.DB.raw.prepare('SELECT count(*) AS n FROM enquiries').get().n, 0);
});
test('oversized body rejected before parsing', async () => {
  const r = new Request('https://example.com/api/enquiries', {
    method: 'POST',
    body: 'synthetic',
    headers: {
      'content-length': String(MAX_BODY_BYTES + 1),
      'content-type': 'multipart/form-data',
    },
  });
  await assert.rejects(
    () => limitedFormData(r),
    (e) => e.status === 413,
  );
});
test('HTML errors preserve input and escape markup', async () => {
  const env = environment();
  const response = await onRequestPost({
    request: request(form({ name: '<script>synthetic</script>', email: 'bad-email' }), {
      Accept: 'text/html',
    }),
    env,
    waitUntil: () => {},
  });
  assert.equal(response.status, 400);
  const html = await response.text();
  assert.ok(html.includes('value="&lt;script&gt;synthetic&lt;/script&gt;"'));
  assert.ok(!html.includes('<script>synthetic</script>'));
});
test('failed Turnstile verification never writes enquiry', async () => {
  const env = environment();
  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ success: false }), {
      headers: { 'Content-Type': 'application/json' },
    });
  try {
    const response = await onRequestPost({ request: request(form()), env, waitUntil: () => {} });
    assert.equal(response.status, 400);
    assert.equal(env.DB.raw.prepare('SELECT count(*) AS n FROM enquiries').get().n, 0);
  } finally {
    globalThis.fetch = original;
  }
});
test('successful verified API request stores receipt before replying', async () => {
  const env = environment();
  const original = globalThis.fetch;
  const pending = [];
  globalThis.fetch = async (url) =>
    new Response(
      JSON.stringify(url.includes('siteverify') ? { success: true, hostname: 'example.com' } : {}),
      { headers: { 'Content-Type': 'application/json' } },
    );
  try {
    const response = await onRequestPost({
      request: request(form()),
      env,
      waitUntil: (p) => pending.push(p),
    });
    assert.equal(response.status, 201);
    const data = await response.json();
    assert.ok(env.DB.raw.prepare('SELECT id FROM enquiries WHERE id = ?').get(data.receipt));
    await Promise.all(pending);
    assert.equal(env.DB.raw.prepare('SELECT state FROM notification_outbox').get().state, 'sent');
  } finally {
    globalThis.fetch = original;
  }
});
