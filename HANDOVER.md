# Handover — 01/10/2026

## Implemented

- 21 static routes including seven service pages, home, about, planning, project archive, reviews, FAQ, contact, areas, legal drafts, styleguide, status and 404.
- Proposed limestone/charcoal/terracotta visual system, self-hosted type, responsive layouts, mobile navigation and call/contact bar.
- Direct telephone/email links, validated email-brief preparation and clipboard export.
- Cloudflare enquiry API with server-side field/type/size validation, Turnstile verification, same-origin checks, honeypot, rate limits and idempotency. D1 schema stores the lead and retry outbox together before private R2 uploads.
- Notification worker retries queued mail with provider idempotency. Upload failures retain the lead and report the incomplete attachment status.
- Preview noindex directives, metadata, canonical URLs, route sitemap, security headers and five legacy redirects.
- Accessible FAQ disclosures, keyboard navigation, privacy dialog and reduced-motion handling.

## Source and truth status

The supplied `REGARDIN_MASTER_PROMPT.md` was read. After the initial proxy 403, network access became available: the live homepage and media API were retrieved, and all nine files from the shared Drive audit folders were downloaded into ignored research storage. Source reconciliation and the live archive are continuing. The Google Drive connector itself remains unavailable; public-folder HTTP retrieval works.

Contact details and testimonial text trace to the supplied document's dated reconciliation. Independent live retrieval is now available; owner publication approval remains outstanding. No business history, registration, insurance, prices, timings or service-area suburbs have been invented. The archive contains no invented projects. Drawings are explicitly labelled concept illustrations.

## External launch blockers

- Approved project photographs, project context and publication permission.
- Primary monitored email, contact approval and testimonial permission.
- Owner/legal review of privacy, terms and actual data-retention/provider arrangements.
- Cloudflare Pages account access and deployment connection; no public preview URL yet.
- D1/R2/Turnstile and notification sender/recipient configuration, followed by end-to-end storage/upload/delivery validation.
- Existing Google property invitations and IDs; no tags or accounts created, no ad spend.
- Production gate clearance after content approval. The live WordPress site, domain and mail records are untouched.

## Validation

21-route preview build, lint, HTML validation and internal-link/content checks pass. All 30 browser tests pass, with zero axe violations across all routes. Six viewport screenshots were generated; mobile, tablet and desktop were inspected.

Lighthouse mobile performance/accessibility/best practices: home 93/100/100, contact 99/100/96, renovation 100/100/100. SEO is 66 on all three because the preview intentionally blocks indexing. No public-host or production validation is claimed.

See `docs/qa-log.md` for findings and corrections.

## Backend validation

13 backend tests passed against the actual SQLite migration schema: validation, rate limiting, duplicate requests, conflicting idempotency, private uploads, upload failure, email retries, cross-origin/honeypot rejection, body limits, HTML escaping, verification failure and accepted receipts. External service responses in these tests are controlled test doubles; actual provider authentication and mailbox delivery remain unverified.

The Cloudflare Functions bundle compiles. Local workerd checks returned disabled configuration, 503 for an unconfigured POST, 301 for the legacy team route and 410 for retired portfolio content. All 30 browser tests still pass. No public endpoint was deployed.
