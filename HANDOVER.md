# Handover — 01/10/2026

## Built and locally verified

22 static routes: seven service pages, home, about, project archive and clearly marked project-layout preview, planning, reviews, FAQ, contact, areas, legal drafts, status, styleguide and 404. Editorial limestone/charcoal/terracotta design, self-hosted fonts, responsive navigation and telephone/email fallback. No invented case studies, badges, dates, suburbs, timelines or registrations.

Cloudflare enquiry API: validated fields/files, origin check, honeypot, rate limiting and Turnstile; transactional D1 lead/outbox storage before private R2 uploads; payload/file idempotency; incomplete-upload reporting; retry worker and interrupted-upload recovery. Attachments use HMAC links expiring after 15 minutes; renewal requires a private operator token. Real account delivery is not verified. JavaScript-disabled browsers can read/navigate the site and call/email; Turnstile prevents a fully JS-free online submission path. This requested feature remains unmet.

Image preparation emits AVIF/WebP responsive sizes and removes EXIF/GPS, only for explicitly approved assets. The public preview uses labelled concept drawings; it does not yet fulfil the requested photo-led final design. Project comparison markup supports verified pairs when approved assets exist; real-pair interaction awaits those assets. OG photograph exports and real share-preview testing remain pending.

Optional analytics integration is disabled. Synthetic tests cover denied defaults, consent/reject/withdraw/reload and event field filtering. No actual Google/Meta tags, accounts, conversions or ad spend are configured. Migration map, evidence/asset/competitor inventories, six paused Ads campaign packs, GBP plan, 30-day social draft and four exportable social templates are committed deliverables, not published campaigns.

## Source review

Attached master preserved byte-for-byte. All nine original Drive audit files read/reconciled. The separate Google Docs master export returned 403; the attachment governs. Existing WordPress site archived across 44 sitemap URLs and rendered through Chromium using TLS-verified curl route mediation; one archive route returned transient 503. Media API yielded 190 records; the recent 100 originals were downloaded privately and visually classified. Photo ownership, client permission and project context remain unverified. No hosting/database backup was available: the HTTP archive is not a full WordPress backup.

20 competitor homepages freshly requested: 19 HTTP 200 and one challenge/403. Two JS shells need rendered review. Raw homepage observations do not establish credentials, ad spend or conversion performance. Google Ads Transparency yielded its application shell, not advertiser evidence. See source inventories and reconciliation documents.

## Validation

22-route build, metadata/internal-link/content gate, lint, HTML validation; 33 browser tests covering route accessibility, six viewports, keyboard menu, brief handling, consent and no-JS navigation. Backend/image suite: 18 tests using actual SQLite schema and controlled external-provider responses. Cloudflare Functions bundle compiles; local runtime previously checked disabled API/503, representative 301 and 410. GitHub workflow added; remote workflow execution is reported separately.

Final Lighthouse mobile performance/accessibility/best practices/SEO: home 100/100/100/66; contact 100/100/96/66; renovations 100/100/100/66; project layout 99/100/100/66. Home/contact/renovation CLS 0; project layout 0.071. Preview SEO score reflects deliberate noindex/robots; production SEO is not verified. A prior run found homepage font-swap CLS 0.225; preloads fixed it. Production approval gate was tested and correctly rejects missing approval.

## Accounts and next steps

Cloudflare identity check reports unauthenticated. Environment install/start instructions and Cloudflare account/token requirements are saved; enter credentials securely in environment settings or connect Pages through an owner invitation. No stable or commit-specific public preview exists. Production has not launched. The existing live domain remains https://regardinconstruction.co.za/ and is unchanged.

After authorised account connection: deploy noindex preview; bind D1/private R2/Turnstile and approved email provider; apply migration; configure signing/operator secrets directly in Cloudflare; deploy retry worker with a five-minute cron; verify synthetic receipt, uploads, duplicate/retry behaviour and actual recipient mailbox delivery. Do not use platform proxy placeholders for runtime signing secrets.

Launch also requires approved contact/monitored email, photograph and testimonial permissions, brand, confirmed service/area/operations facts, and owner/legal review of terms, retention, Information Officer and cross-border providers. Existing Google/Meta invitations are needed before account tasks. The grouped confirmation register avoids repeated questions; none of these prevented building this draft.

Before domain cutover: authorised private WordPress backup, Search Console/backlink review, production content/SEO/security checks and rollback window. Preserve MX/SPF/DKIM/DMARC. No DNS, live-site, messaging or advertising changes have occurred.
