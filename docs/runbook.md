# Development and release runbook

Use the existing isolated checkout. Node 24.19.0 was verified; Vite 8.3.1 supports Node 20.19+/22.12+ per its official guide. The environment uses Node 24.

## Local development

Run `npm ci --ignore-scripts`, `npm run build`, then `npm run dev`. Static content works without client rendering. Preview routes are noindex; raw source research is ignored. Use `CHROME_PATH=/usr/bin/chromium npm test` when system Chromium is installed.

For Cloudflare runtime checks: `WRANGLER_SEND_METRICS=false XDG_CONFIG_HOME=/workspace/.config WRANGLER_LOG_PATH=/tmp/regardin-pages.log npm exec wrangler -- pages dev dist --port 8788 --compatibility-date=2026-09-30 --d1 DB=local-regardin --r2 UPLOADS=local-regardin-uploads --binding SITE_MODE=preview`. This local service is not a public deployment.

## Cloudflare account setup

Connect the confirmed repository to an authorised Pages account. Build `npm run build`, output `dist`, Node 24. Keep the preview hostname separate from the live domain. Do not change DNS or mail records.

Create/bind D1 as `DB` and apply `migrations/0001_enquiries.sql`. Bind a private R2 bucket as `UPLOADS`; do not enable its public access. Configure `PUBLIC_ORIGIN` to the exact Pages origin, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET`, `EMAIL_API_KEY`, `FROM_EMAIL`, `NOTIFICATION_EMAIL`, `UPLOAD_LINK_SECRET`, `OPERATOR_TOKEN`. Generate the last two as strong independent secrets directly in Cloudflare’s secret settings; the signing key is used locally by Web Crypto and must be a real runtime secret, not a proxy placeholder. Resend is an implemented notification adapter, a proposed provider pending approval; replace only after a provider decision. Use an authenticated sender and customer Reply-To.

Deploy `workers/notifications.js` as an authorised scheduled Worker with the same D1 and mail bindings. Set a five-minute cron schedule. Monitor outbox entries in pending/sending state and attempt count. The runtime compiler has been checked; account deployment has not.

Private attachments remain in R2. Notification emails include HMAC-signed download URLs expiring after 15 minutes. Links reject expiry/tampering and force a download with no-store/sandbox headers. An authorised operator can POST an attachment ID to `/api/attachments/links` using the configured Bearer operator token to renew a link. Never put that token into a public page or client bundle. Rotation, retention, access ownership and live account testing remain required before launch.

Turnstile requires JavaScript. The API returns accessible HTML for normal multipart submissions with a valid verification token, but a fully JavaScript-disabled browser uses the direct telephone/email fallback. A JS-free verified online submission path is not yet implemented; this limitation is explicit rather than bypassing abuse prevention.

## Enquiry readiness

GET `/api/enquiries` reports enabled only with all required bindings. Submit synthetic data on the deployed preview: test receipt storage, duplicates, rejected files, upload failure, notification retries and actual mailbox receipt. A provider HTTP 200 is not delivered-mail evidence. Do not use a real customer's enquiry for QA.

## Production and rollback

Resolve the confirmation register and approve legal/data flows. Production build fails while approval flags or `[CONFIRM]` content remain. Verify real status codes, crawlability, CSP, metadata, redirects and domain behaviour on the authorised deployment.

Before any domain cutover: obtain a private WordPress/hosting backup and restore instructions, check Search Console/backlinks, preserve all MX/SPF/DKIM/DMARC records and retain the old hosting through the agreed rollback window. No cutover, backup access or DNS change was performed here.
