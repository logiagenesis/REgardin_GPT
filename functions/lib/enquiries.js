import services from '../../src/data/services.json' with { type: 'json' };
export const MAX_FILE_BYTES = 8 * 1024 * 1024;
export const MAX_BODY_BYTES = 42 * 1024 * 1024;
const allowedServices = new Set([...services.map((s) => s.slug), 'not-sure']);
export class EnquiryError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
export const isConfigured = (env) =>
  Boolean(
    env.DB &&
    env.UPLOADS &&
    env.TURNSTILE_SECRET &&
    env.TURNSTILE_SITE_KEY &&
    env.EMAIL_API_KEY &&
    env.NOTIFICATION_EMAIL &&
    env.FROM_EMAIL &&
    env.PUBLIC_ORIGIN,
  );
export async function hash(value) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest(
        'SHA-256',
        typeof value === 'string' ? new TextEncoder().encode(value) : value,
      ),
    ),
    (b) => b.toString(16).padStart(2, '0'),
  ).join('');
}
export function validateFields(form) {
  const read = (name, max, required = true) => {
    const raw = form.get(name);
    if (raw !== null && typeof raw !== 'string') throw new EnquiryError('Invalid ' + name + '.');
    const value = (raw || '').trim();
    if (
      (required && !value) ||
      value.length > max ||
      Array.from(value).some((c) => {
        const n = c.charCodeAt(0);
        return n <= 8 || n === 11 || n === 12 || (n >= 14 && n <= 31);
      })
    )
      throw new EnquiryError('Please check your ' + name + '.');
    return value;
  };
  const data = {
    name: read('name', 100),
    phone: read('phone', 40),
    email: read('email', 254),
    suburb: read('suburb', 100),
    service: read('service', 80),
    brief: read('brief', 5000),
    timing: read('timing', 150, false),
  };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || /[\r\n]/.test(data.email))
    throw new EnquiryError('Please enter a valid email address.');
  if (!/^[+\d\s().-]{7,40}$/.test(data.phone) || data.phone.replace(/\D/g, '').length < 7)
    throw new EnquiryError('Please enter a valid phone number.');
  if (!allowedServices.has(data.service))
    throw new EnquiryError('Please choose an available service.');
  if (data.brief.length < 20)
    throw new EnquiryError('Please add a little more detail to your project brief.');
  return data;
}
export async function validateFiles(form) {
  const files = form.getAll('photos').filter((f) => typeof f !== 'string' && f.size > 0);
  if (files.length > 5) throw new EnquiryError('Please attach no more than five files.');
  for (const file of files) {
    if (file.size > MAX_FILE_BYTES)
      throw new EnquiryError('Each attachment must be 8 MB or smaller.');
    if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type))
      throw new EnquiryError('Use JPEG, PNG, WebP or PDF attachments.');
    const b = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    const ascii = (start, end) => String.fromCharCode(...b.slice(start, end));
    const valid =
      file.type === 'image/jpeg'
        ? b[0] === 255 && b[1] === 216 && b[2] === 255
        : file.type === 'image/png'
          ? b.slice(0, 8).join(',') === '137,80,78,71,13,10,26,10'
          : file.type === 'image/webp'
            ? ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP'
            : ascii(0, 5) === '%PDF-';
    if (!valid) throw new EnquiryError('An attachment does not match its declared file type.');
  }
  return files;
}
export async function limitedFormData(request) {
  const declared = Number(request.headers.get('content-length'));
  if (declared > MAX_BODY_BYTES)
    throw new EnquiryError('The total attachment size is too large.', 413);
  if (!request.body) throw new EnquiryError('The enquiry is empty.');
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new EnquiryError('The enquiry is too large.', 413);
    }
    chunks.push(value);
  }
  try {
    return await new Response(new Blob(chunks), {
      headers: { 'Content-Type': request.headers.get('content-type') || '' },
    }).formData();
  } catch {
    throw new EnquiryError('Please submit a valid project enquiry.');
  }
}
export async function takeRateLimit(db, identity, now = Date.now()) {
  const start = Math.floor(now / 600000) * 600000;
  const row = await db
    .prepare(
      'INSERT INTO rate_limits (identity_hash, window_start, count) VALUES (?, ?, 1) ON CONFLICT(identity_hash) DO UPDATE SET count = CASE WHEN window_start = excluded.window_start THEN count + 1 ELSE 1 END, window_start = excluded.window_start RETURNING count',
    )
    .bind(identity, start)
    .first();
  return row.count <= 5;
}
export async function storeEnquiry(env, data, key, files, now = new Date().toISOString()) {
  const payloadHash = await hash(
    JSON.stringify(data) +
      JSON.stringify(
        await Promise.all(
          files.map(async (f) => [f.name, f.type, f.size, await hash(await f.arrayBuffer())]),
        ),
      ),
  );
  const id = crypto.randomUUID();
  const insert = env.DB.prepare(
    'INSERT INTO enquiries (id, idempotency_key, payload_hash, name, phone, email, suburb, service, brief, timing, created_at, upload_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(idempotency_key) DO NOTHING RETURNING id',
  ).bind(
    id,
    key,
    payloadHash,
    data.name,
    data.phone,
    data.email,
    data.suburb,
    data.service,
    data.brief,
    data.timing,
    now,
    files.length ? 'pending' : 'none',
  );
  const queue = env.DB.prepare(
    'INSERT INTO notification_outbox (enquiry_id, next_attempt_at) SELECT id, ? FROM enquiries WHERE id = ? ON CONFLICT(enquiry_id) DO NOTHING',
  ).bind(now, id);
  const batch = await env.DB.batch([insert, queue]);
  const inserted = batch[0].results[0];
  if (!inserted) {
    const prior = await env.DB.prepare(
      'SELECT id, payload_hash, upload_status FROM enquiries WHERE idempotency_key = ?',
    )
      .bind(key)
      .first();
    if (prior.payload_hash !== payloadHash)
      throw new EnquiryError(
        'This enquiry key was already used for a different brief. Reload the form to start a new enquiry.',
        409,
      );
    return { receipt: prior.id, duplicate: true, uploadStatus: prior.upload_status };
  }
  // The lead exists durably before uploads or notification are attempted.
  let uploadStatus = 'none';
  if (files.length) {
    uploadStatus = 'complete';
    for (const file of files) {
      const fileId = crypto.randomUUID();
      const storageKey = `enquiries/${id}/${fileId}`;
      try {
        await env.UPLOADS.put(storageKey, await file.arrayBuffer(), {
          httpMetadata: { contentType: file.type },
          customMetadata: { enquiryId: id },
        });
        await env.DB.prepare(
          'INSERT INTO attachments (id, enquiry_id, storage_key, original_name, content_type, byte_size) VALUES (?, ?, ?, ?, ?, ?)',
        )
          .bind(
            fileId,
            id,
            storageKey,
            file.name
              .replace(/[\r\n]/g, '')
              .split('\u0000')
              .join('')
              .slice(0, 200),
            file.type,
            file.size,
          )
          .run();
      } catch {
        uploadStatus = 'incomplete';
        try {
          await env.UPLOADS.delete(storageKey);
        } catch {
          /* Orphan cleanup is an operator task; the durable lead is preserved. */
        }
      }
    }
    await env.DB.prepare('UPDATE enquiries SET upload_status = ? WHERE id = ?')
      .bind(uploadStatus, id)
      .run();
  }
  return { receipt: id, duplicate: false, uploadStatus };
}
export async function notifyPending(env, receipt, fetcher = fetch, now = new Date().toISOString()) {
  const row = await env.DB.prepare(
    'SELECT e.*, n.attempts, n.state FROM enquiries e JOIN notification_outbox n ON e.id = n.enquiry_id WHERE e.id = ?',
  )
    .bind(receipt)
    .first();
  if (!row || row.state === 'sent' || row.state === 'sending') return false;
  const claim = await env.DB.prepare(
    "UPDATE notification_outbox SET state = 'sending', next_attempt_at = ? WHERE enquiry_id = ? AND state = 'pending' RETURNING enquiry_id",
  )
    .bind(new Date(Date.parse(now) + 300000).toISOString(), receipt)
    .first();
  if (!claim) return false;
  try {
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + env.EMAIL_API_KEY,
        'Content-Type': 'application/json',
        'Idempotency-Key': 'regardin-' + receipt,
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: [env.NOTIFICATION_EMAIL],
        reply_to: row.email,
        subject: 'Regardin project enquiry — ' + row.service,
        text: `Receipt: ${receipt}\nName: ${row.name}\nPhone: ${row.phone}\nEmail: ${row.email}\nSuburb: ${row.suburb}\nService: ${row.service}\nTiming: ${row.timing || 'Not specified'}\nAttachments: ${row.upload_status}\n\n${row.brief}\n\nAttachments remain in private storage. Use the authorised account to retrieve them; no public link is included.`,
      }),
    });
    if (!response.ok) throw new Error('Notification provider rejected request: ' + response.status);
    await env.DB.prepare(
      "UPDATE notification_outbox SET state = 'sent', sent_at = ?, attempts = attempts + 1, last_error = NULL WHERE enquiry_id = ?",
    )
      .bind(now, receipt)
      .run();
    return true;
  } catch {
    const next = new Date(
      Date.parse(now) + Math.min(86400000, 60000 * 2 ** Math.min(row.attempts, 10)),
    ).toISOString();
    await env.DB.prepare(
      "UPDATE notification_outbox SET state = 'pending', attempts = attempts + 1, next_attempt_at = ?, last_error = 'Notification failed; retry queued' WHERE enquiry_id = ?",
    )
      .bind(next, receipt)
      .run();
    return false;
  }
}
