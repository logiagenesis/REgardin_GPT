const uuid = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;
const maxAge = 15 * 60;
const base64url = (bytes) =>
  btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
async function key(secret) {
  if (typeof secret !== 'string' || secret.length < 32)
    throw new Error('Upload-link signing is not configured.');
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}
export async function createAttachmentLink(env, id, now = Math.floor(Date.now() / 1000)) {
  if (!uuid.test(id)) throw new Error('Invalid attachment identifier.');
  const expires = now + maxAge;
  const signature = new Uint8Array(
    await crypto.subtle.sign(
      'HMAC',
      await key(env.UPLOAD_LINK_SECRET),
      new TextEncoder().encode(`${id}:${expires}`),
    ),
  );
  const url = new URL(`/api/attachments/${id}`, env.PUBLIC_ORIGIN);
  url.searchParams.set('expires', String(expires));
  url.searchParams.set('signature', base64url(signature));
  return url.toString();
}
export async function verifyAttachmentLink(env, id, url, now = Math.floor(Date.now() / 1000)) {
  const expires = Number(url.searchParams.get('expires'));
  const signature = url.searchParams.get('signature') || '';
  if (
    !uuid.test(id) ||
    !Number.isSafeInteger(expires) ||
    expires <= now ||
    expires > now + maxAge ||
    !/^[\w-]{43}$/.test(signature)
  )
    return false;
  try {
    const bytes = Uint8Array.from(
      atob(signature.replaceAll('-', '+').replaceAll('_', '/') + '='),
      (c) => c.charCodeAt(0),
    );
    return crypto.subtle.verify(
      'HMAC',
      await key(env.UPLOAD_LINK_SECRET),
      bytes,
      new TextEncoder().encode(`${id}:${expires}`),
    );
  } catch {
    return false;
  }
}
export async function operatorAuthorised(request, env) {
  const secret = env.OPERATOR_TOKEN;
  const supplied = request.headers.get('authorization')?.replace(/^Bearer /, '') || '';
  if (typeof secret !== 'string' || secret.length < 32 || !supplied || supplied.length > 512)
    return false;
  const digest = async (text) =>
    new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
  const [left, right] = await Promise.all([digest(secret), digest(supplied)]);
  let different = 0;
  for (let i = 0; i < left.length; i++) different |= left[i] ^ right[i];
  return different === 0;
}
