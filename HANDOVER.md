# Handover — 01/10/2026

## Built and locally verified

22 static routes: seven service pages, home, about, project archive and clearly marked project-layout preview, planning, reviews, FAQ, contact, areas, legal drafts, status, styleguide and 404. Editorial limestone/charcoal/terracotta design, self-hosted fonts, responsive navigation and telephone/email fallback. No invented case studies, badges, dates, suburbs, timelines or registrations.

User-confirmed hosting target: **cPanel**, overriding the attached document's default. The cPanel ZIP contains the built static site, Apache configuration and PHP enquiry implementation. No Node server or Cloudflare service is required on the host. Earlier Functions/Worker code is historical and excluded from this package.

PHP enquiries validate fields and detected MIME/size/count, enforce session CSRF/origin/honeypot/rate limits, and transactionally store the lead plus outbox in private SQLite before uploads/mail. Private uploads use opaque names; downloads use expiring HMAC links and operator-authorised renewal. Native HTML POST works without JavaScript, preserves escaped error input and shows a session receipt only after storage. Local HTTP checks passed for these paths. Host extension/session/HTTPS configuration and actual mailbox receipt remain unverified. Failed mail handoff queues retry; interrupted handoff requires operator review to avoid silently repeating a potentially sent message.

Image preparation emits AVIF/WebP responsive sizes and removes EXIF/GPS, only for explicitly approved assets. The public preview uses labelled concept drawings; it does not yet fulfil the requested photo-led final design. Project comparison markup supports verified pairs when approved assets exist; real-pair interaction awaits those assets. OG photograph exports and real share-preview testing remain pending.

Optional analytics integration is disabled. Synthetic tests cover denied defaults, consent/reject/withdraw/reload and event field filtering. No actual Google/Meta tags, accounts, conversions or ad spend are configured. Migration map, evidence/asset/competitor inventories, six paused Ads campaign packs, GBP plan, 30-day social draft and four exportable social templates are committed deliverables, not published campaigns.

## Source review

Attached master preserved byte-for-byte. All nine original Drive audit files read/reconciled. The separate Google Docs master export returned 403; the attachment governs. Existing WordPress site archived across 44 sitemap URLs and rendered through Chromium using TLS-verified curl route mediation; one archive route returned transient 503. Media API yielded 190 records; the recent 100 originals were downloaded privately and visually classified. Photo ownership, client permission and project context remain unverified. No hosting/database backup was available: the HTTP archive is not a full WordPress backup.

20 competitor homepages freshly requested: 19 HTTP 200 and one challenge/403. Two JS shells need rendered review. Raw homepage observations do not establish credentials, ad spend or conversion performance. Google Ads Transparency yielded its application shell, not advertiser evidence. See source inventories and reconciliation documents.

## Validation

22-route build, metadata/internal-link/content gate, lint, HTML validation; Linkinator 8.1.0 reports 34 checked links and zero broken (local origins, CSS and fragments); 33 browser tests covering route accessibility, six viewports, keyboard menu, brief handling, consent and no-JS navigation. Backend/image/PHP suite: 21 tests using actual SQLite schema and controlled external-provider responses. Cloudflare Functions bundle compiles; local runtime previously checked disabled API/503, representative 301 and 410. GitHub workflow added; remote workflow execution is reported separately.

Final Lighthouse mobile performance/accessibility/best practices/SEO: home 100/100/100/66; contact 99/100/96/66; renovations 100/100/100/66; project layout 99/100/100/66. Home/contact/renovation CLS 0; project layout 0.071. Preview SEO score reflects deliberate noindex/robots; production SEO is not verified. A prior run found homepage font-swap CLS 0.225; preloads fixed it. Production approval gate was tested and correctly rejects missing approval.

## Accounts and next steps

The committed package is `releases/regardin-cpanel-preview.zip`; its checksum and deployment instructions are adjacent/in docs/cpanel-deployment.md. No cPanel staging account access or hostname is supplied to this execution environment, so no upload, stable public preview or commit-specific preview is claimed. Production has not launched. The live site remains https://regardinconstruction.co.za/ and is unchanged.

Upload the package through authorised cPanel access into an isolated staging document root, with private as a sibling outside every public document root. Verify PHP 8.2+, PDO SQLite, fileinfo and secure sessions; configure exact HTTPS origin, writable private storage, independent secrets and confirmed mail sender/recipient. Configure the five-minute private PHP cron. Then verify staging Apache status/headers, synthetic storage/upload/duplicates, no-JS forms and actual mailbox delivery. The account and real PHP capabilities are not guessed.

Cloud environment setup/start instructions now target cPanel packaging and PHP testing. The previously declared Cloudflare account/token metadata is obsolete and unused; the configuration API cannot delete previously declared requirements, and no credentials were supplied. No Cloudflare token is needed for this build or deployment.

Launch requires approved contact/monitored email, photo/testimonial permissions, brand and legal review of terms, retention and data providers. Existing Google/Meta invitations remain needed before account work. Before any authorised cutover, take a private WordPress backup and verify restore, review Search Console/backlinks and preserve MX/SPF/DKIM/DMARC. No DNS, live-site, messaging or advertising changes occurred.

## Pushed release

Website release fec5088d8fe7a9caf4fdf04193eae09eec11300a is on main and verified by git ls-remote. Repository: https://github.com/logiagenesis/REgardin_GPT. Desktop/mobile screenshots are committed under docs/screenshots. A subsequent documentation commit records this receipt; it does not deploy the site. Initial Actions API status retrieval returned proxy 403, so remote CI is not claimed.

## cPanel correction validation

cPanel PHP syntax, real SQLite/private access unit checks and real PHP HTTP multipart/native-form regression tests passed. The earlier JS-free submission limitation is resolved in the cPanel handler; staging browser/HTTPS acceptance remains pending account access. The cPanel package replaces Cloudflare-specific legal/deployment instructions. PHP session-storage configuration and the receipt-rendering callback were corrected during local checks. Browser regressions and Lighthouse results are recorded in docs/qa-log.md. The Apache configuration is packaged but not claimed tested on a real cPanel account.
