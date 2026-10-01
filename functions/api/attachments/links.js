import { createAttachmentLink, operatorAuthorised } from '../../lib/attachment-links.js';
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
export async function onRequestPost({ request, env }) {
  if (!(await operatorAuthorised(request, env)))
    return json({ error: 'Authorised operator access is required.' }, 403);
  if (!env.DB || !env.UPLOAD_LINK_SECRET || !env.PUBLIC_ORIGIN)
    return json({ error: 'Attachment links are not configured.' }, 503);
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Please provide an attachment identifier.' }, 400);
  }
  if (typeof data.id !== 'string' || !/^[\da-f-]{36}$/i.test(data.id))
    return json({ error: 'Invalid attachment identifier.' }, 400);
  const exists = await env.DB.prepare('SELECT id FROM attachments WHERE id = ?')
    .bind(data.id)
    .first();
  if (!exists) return json({ error: 'Attachment not found.' }, 404);
  try {
    return json({ url: await createAttachmentLink(env, data.id), expiresInSeconds: 900 });
  } catch {
    return json({ error: 'Attachment signing is not configured.' }, 503);
  }
}
