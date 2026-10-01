import { verifyAttachmentLink } from '../../lib/attachment-links.js';
export async function onRequestGet({ request, env, params }) {
  const headers = {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; sandbox",
  };
  if (
    !env.DB ||
    !env.UPLOADS ||
    !(await verifyAttachmentLink(env, params.id, new URL(request.url)))
  )
    return new Response('This attachment link is invalid or expired.', { status: 403, headers });
  const record = await env.DB.prepare(
    'SELECT storage_key, original_name, content_type FROM attachments WHERE id = ?',
  )
    .bind(params.id)
    .first();
  if (!record) return new Response('Attachment not found.', { status: 404, headers });
  const object = await env.UPLOADS.get(record.storage_key);
  if (!object) return new Response('Attachment not found.', { status: 404, headers });
  const filename =
    record.original_name.replace(/[^a-zA-Z0-9._ -]/g, '_').slice(0, 150) || 'attachment';
  return new Response(object.body, {
    headers: {
      ...headers,
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
