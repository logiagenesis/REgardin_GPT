import {
  EnquiryError,
  escapeHtml,
  isConfigured,
  hash,
  limitedFormData,
  validateFields,
  validateFiles,
  takeRateLimit,
  storeEnquiry,
  notifyPending,
} from '../lib/enquiries.js';
import { render, routes } from '../../src/render.js';
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
function respond(request, data, status = 200, form = null) {
  if (request.headers.get('accept')?.includes('application/json')) return json(data, status);
  if (status >= 400) {
    let html = render(routes.find((r) => r.kind === 'contact'));
    html = html.replace(
      '<form id="enquiry-form"',
      `<p role="alert" class="confirmation">${escapeHtml(data.error)}</p><form id="enquiry-form"`,
    );
    if (form) {
      for (const field of ['name', 'phone', 'email', 'suburb', 'timing']) {
        const value = form.get(field);
        if (typeof value === 'string')
          html = html.replace(
            new RegExp(`(<input[^>]*id="${field}"[^>]*)(>)`),
            (_match, open, close) => `${open} value="${escapeHtml(value).slice(0, 1000)}"${close}`,
          );
      }
      const brief = form.get('brief');
      if (typeof brief === 'string')
        html = html.replace(
          /(<textarea[^>]*id="brief"[^>]*>)[\s\S]*?<\/textarea>/,
          (_, open) => open + escapeHtml(brief).slice(0, 10000) + '</textarea>',
        );
      const service = form.get('service');
      if (typeof service === 'string')
        html = html.replace(
          `value="${escapeHtml(service)}">`,
          `value="${escapeHtml(service)}" selected>`,
        );
    }
    return new Response(html, {
      status,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }
  const message =
    data.uploadStatus === 'incomplete'
      ? 'Your enquiry was saved, but one or more attachments could not be stored. Please contact Regardin to arrange another way to share them.'
      : 'Your enquiry has been saved. This is a storage receipt, not a booking or confirmation of mailbox delivery.';
  return new Response(
    `<!DOCTYPE html><html lang="en-ZA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Enquiry saved | Regardin Construction</title></head><body><main><h1>Your enquiry has been saved.</h1><p>${message}</p><p>Receipt: ${escapeHtml(data.receipt)}</p><a href="/contact/">Return to contact</a></main></body></html>`,
    {
      status,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    },
  );
}
export function onRequestGet({ env }) {
  return json({
    enabled: isConfigured(env),
    siteKey: isConfigured(env) ? env.TURNSTILE_SITE_KEY : null,
  });
}
export async function onRequestPost(context) {
  const { request, env } = context;
  let form = null;
  try {
    if (!isConfigured(env))
      throw new EnquiryError(
        'Online enquiries are not connected. Please use the email or telephone contact options.',
        503,
      );
    const origin = request.headers.get('origin');
    if (origin !== new URL(env.PUBLIC_ORIGIN).origin)
      throw new EnquiryError('Please submit the enquiry from the Regardin website.', 403);
    form = await limitedFormData(request);
    if (form.get('website')) throw new EnquiryError('The enquiry could not be accepted.', 400);
    const data = validateFields(form);
    const files = await validateFiles(form);
    const identity = await hash(
      (request.headers.get('cf-connecting-ip') || 'unknown') + env.TURNSTILE_SECRET,
    );
    if (!(await takeRateLimit(env.DB, identity)))
      throw new EnquiryError(
        'Too many enquiries in a short time. Please wait before trying again.',
        429,
      );
    const token = form.get('cf-turnstile-response');
    if (typeof token !== 'string' || !token || token.length > 2048)
      throw new EnquiryError('Please complete the verification check.');
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: request.headers.get('cf-connecting-ip') || '',
      }),
    });
    if (!verification.ok)
      throw new EnquiryError(
        'Verification is temporarily unavailable. Your details have not been sent.',
        503,
      );
    const result = await verification.json();
    if (!result.success || result.hostname !== new URL(env.PUBLIC_ORIGIN).hostname)
      throw new EnquiryError('Verification did not pass. Please try again.');
    const key = form.get('idempotencyKey');
    if (
      typeof key !== 'string' ||
      !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(key)
    )
      throw new EnquiryError('Please reload the form before submitting.');
    const receipt = await storeEnquiry(env, data, key, files);
    context.waitUntil(notifyPending(env, receipt.receipt));
    return respond(request, receipt, receipt.duplicate ? 200 : 201);
  } catch (error) {
    return respond(
      request,
      {
        error:
          error instanceof EnquiryError
            ? error.message
            : 'The enquiry could not be saved. Please try again or contact Regardin directly.',
      },
      error instanceof EnquiryError ? error.status : 503,
      form,
    );
  }
}
