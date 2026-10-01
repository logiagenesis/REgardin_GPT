import { mkdir, writeFile, rm, mkdtemp } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
const base = 'http://127.0.0.1:8092';
const work = await mkdtemp(tmpdir() + '/regardin-http-');
const router = work + '/router.php';
await writeFile(
  router,
  `<?php
$path=parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
if ($path==='/api/enquiries') { require $_SERVER['DOCUMENT_ROOT'].'/api/enquiries/index.php'; return true; }
return false;`,
);
await mkdir(work + '/sessions', { mode: 0o700 });
const server = spawn(
  process.env.PHP_BIN || 'php',
  [
    '-d',
    'display_errors=0',
    '-d',
    'session.save_path=' + work + '/sessions',
    '-d',
    'post_max_size=42M',
    '-d',
    'upload_max_filesize=8M',
    '-S',
    '127.0.0.1:8092',
    '-t',
    resolve('.cpanel/public_html'),
    router,
  ],
  { env: { ...process.env, REGARDIN_CONFIG: work + '/config.php' }, stdio: 'ignore' },
);
const storage = work + '/storage';
await mkdir(storage, { recursive: true, mode: 0o700 });
const config = work + '/config.php';
const synthetic = `<?php return ['enabled'=>true,'origin'=>'https://synthetic.example','storage'=>'${storage}','secret'=>'synthetic-signing-key-not-real-000000000000','operator_token'=>'synthetic-operator-key-not-real-000000000000','from_email'=>'synthetic@example.com','notification_email'=>'synthetic-recipient@example.com'];`;
try {
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      await fetch(base + '/');
      break;
    } catch {
      if (attempt === 29) throw new Error('PHP test server did not start');
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  const disabled = await (await fetch(base + '/api/enquiries')).json();
  assert.equal(disabled.enabled, false);
  await writeFile(config, synthetic);
  const response = await fetch(base + '/api/enquiries');
  const cookie = response.headers.get('set-cookie').split(';')[0];
  const settings = await response.json();
  assert.equal(settings.enabled, true);
  const contact = await (await fetch(base + '/contact/', { headers: { Cookie: cookie } })).text();
  assert.match(contact, /name="csrf" value="[a-f0-9]{64}"/);
  assert.match(contact, /name="photos\[\]"/);
  assert.doesNotMatch(contact, /id="submit-enquiry" class="button" hidden/);
  const key = randomUUID();
  const form = (file = false) => {
    const f = new FormData();
    for (const [k, v] of Object.entries({
      name: 'Synthetic Test',
      phone: '+27000000000',
      email: 'synthetic@example.com',
      suburb: 'Test location',
      service: 'painting',
      brief: 'Synthetic HTTP enquiry only, not a customer.',
      timing: '',
      website: '',
      csrf: settings.csrf,
      idempotencyKey: key,
    }))
      f.set(k, v);
    if (file)
      f.set(
        'photos[]',
        new Blob(['%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF'], {
          type: 'application/pdf',
        }),
        'test.pdf',
      );
    return f;
  };
  const headers = {
    Cookie: cookie,
    Origin: 'https://synthetic.example',
    Accept: 'application/json',
  };
  const invalid = form();
  invalid.set('csrf', 'invalid');
  assert.equal(
    (await fetch(base + '/api/enquiries', { method: 'POST', body: invalid, headers })).status,
    403,
  );
  const submitted = await fetch(base + '/api/enquiries', {
    method: 'POST',
    body: form(true),
    headers,
  });
  const result = await submitted.json();
  assert.equal(submitted.status, 200, JSON.stringify(result));
  assert.equal(result.uploadStatus, 'complete');
  const duplicate = await (
    await fetch(base + '/api/enquiries', { method: 'POST', body: form(true), headers })
  ).json();
  assert.equal(duplicate.receipt, result.receipt);
  assert.equal(duplicate.duplicate, true);
  const htmlPost = form(false);
  htmlPost.set('idempotencyKey', randomUUID());
  const accepted = await fetch(base + '/api/enquiries', {
    method: 'POST',
    body: htmlPost,
    headers: { ...headers, Accept: 'text/html' },
    redirect: 'manual',
  });
  assert.equal(accepted.status, 303);
  assert.equal(accepted.headers.get('location'), '/thank-you/');
  const receipt = await (await fetch(base + '/thank-you/', { headers: { Cookie: cookie } })).text();
  assert.match(receipt, /Your enquiry has been saved/);
  const direct = await (await fetch(base + '/thank-you/', { headers: { Cookie: cookie } })).text();
  assert.doesNotMatch(direct, /Your enquiry has been saved/);
  const bad = form();
  bad.set('name', '<script>synthetic</script>');
  bad.set('brief', 'short');
  const rejected = await fetch(base + '/api/enquiries', {
    method: 'POST',
    body: bad,
    headers: { ...headers, Accept: 'text/html' },
    redirect: 'manual',
  });
  assert.equal(rejected.status, 303);
  const error = await (await fetch(base + '/contact/', { headers: { Cookie: cookie } })).text();
  assert.match(error, /&lt;script&gt;synthetic&lt;\/script&gt;/);
  assert.match(error, /role="alert"/);
  console.log(
    'PASS: real PHP HTTP session verification, configured controls, multipart PDF persistence, duplicates, native HTML POST/receipt and escaped error restoration. Mailbox delivery is not tested.',
  );
} finally {
  await rm(config, { force: true });
  await rm(storage, { recursive: true, force: true });
  server.kill();
  await rm(work, { recursive: true, force: true });
}
