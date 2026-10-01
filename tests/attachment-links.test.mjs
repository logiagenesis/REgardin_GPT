import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createAttachmentLink,
  verifyAttachmentLink,
  operatorAuthorised,
} from '../functions/lib/attachment-links.js';
import { onRequestGet } from '../functions/api/attachments/[id].js';
const env = {
  UPLOAD_LINK_SECRET: 'synthetic-signing-secret-used-only-in-unit-tests',
  OPERATOR_TOKEN: 'synthetic-operator-secret-used-only-in-unit-tests',
  PUBLIC_ORIGIN: 'https://example.com',
};
test('signed attachment links expire and reject tampering', async () => {
  const id = crypto.randomUUID();
  const url = new URL(await createAttachmentLink(env, id, 1000));
  assert.equal(await verifyAttachmentLink(env, id, url, 1001), true);
  assert.equal(await verifyAttachmentLink(env, id, url, 1900), false);
  assert.equal(await verifyAttachmentLink(env, crypto.randomUUID(), url, 1001), false);
  url.searchParams.set('expires', '1901');
  assert.equal(await verifyAttachmentLink(env, id, url, 1001), false);
});
test('operator token is required to renew attachment links', async () => {
  assert.equal(await operatorAuthorised(new Request('https://example.com'), env), false);
  assert.equal(
    await operatorAuthorised(
      new Request('https://example.com', { headers: { Authorization: 'Bearer invalid' } }),
      env,
    ),
    false,
  );
  assert.equal(
    await operatorAuthorised(
      new Request('https://example.com', {
        headers: { Authorization: 'Bearer ' + env.OPERATOR_TOKEN },
      }),
      env,
    ),
    true,
  );
});
test('attachment downloads reject unsigned access and force safe download', async () => {
  const id = crypto.randomUUID();
  const local = {
    ...env,
    DB: {
      prepare: () => ({
        bind: () => ({
          first: async () => ({
            storage_key: 'private/test-only',
            original_name: 'test-only.pdf',
            content_type: 'application/pdf',
          }),
        }),
      }),
    },
    UPLOADS: { get: async () => ({ body: '%PDF-synthetic test content' }) },
  };
  let response = await onRequestGet({
    request: new Request('https://example.com/api/attachments/' + id),
    env: local,
    params: { id },
  });
  assert.equal(response.status, 403);
  response = await onRequestGet({
    request: new Request(await createAttachmentLink(env, id)),
    env: local,
    params: { id },
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/octet-stream');
  assert.ok(response.headers.get('content-disposition').startsWith('attachment;'));
  assert.equal(response.headers.get('cache-control'), 'no-store');
});
