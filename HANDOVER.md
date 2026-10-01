# Handover — 01/10/2026

## Rebuilt construction website

22 routes cover the homepage, company, seven services, portfolio, construction gallery, planning, reviews, FAQ, contact, areas, legal drafts, status, styleguide and 404. A dedicated copywriter rewrote the main content against the archived source site. The new homepage uses a split photographic opening, warm mineral tones, Bodoni Moda headings, a compact interactive service index and staggered selected work. The heavy overlay and repeated boxed homepage cards have been removed. Service pages share the new type and spacing system, with shorter headings and actual source photographs; the original green Regardin logo is retained. The portfolio contains 16 selected source photographs; no client names, locations, dates or project outcomes are invented.

The user explicitly authorised source-image reuse for this redesign. Original source URLs and hashes are recorded in docs/asset-manifest.csv and src/data/assets.json; copy sources are recorded in src/data/copy.json. Committed responsive AVIF/WebP derivatives strip EXIF/GPS and support reproducible builds without the private original-photo archive. Original testimonial wording remains intact. Production ownership, client permissions and business/legal review remain separate launch items.

## Hosting and enquiries

User-confirmed full-site hosting is **cPanel**, overriding the attachment’s default. The separate static preview is **https://logiagenesis.github.io/REgardin_GPT/**. GitHub Actions deploys pushes to main; the preceding Pages release was observed successful. The current release’s workflow result is recorded in the release receipt after push. Direct preview HTTP access from this environment is blocked by the network proxy, so remote page rendering is not claimed.

The committed releases/regardin-cpanel-preview.zip and checksum contain root-path static pages, Apache configuration and PHP enquiry handling. Node and Cloudflare are not required on the host. GitHub Pages uses repository-prefixed links and cannot execute PHP; its backend is deliberately disabled, with call/email brief preparation available.

PHP 8.2+ with PDO SQLite and fileinfo stores enquiries and queued notifications transactionally in private SQLite before uploading/notifying. Session CSRF, origin, honeypot, rate limiting, idempotency, MIME/count/size limits and expiring private-download links are implemented. Native HTML POST preserves escaped error input and shows a receipt only after storage. Local PHP HTTP tests exercise these paths. Failed mail handoff queues retry; an interrupted sending attempt needs operator review to avoid accidental duplicate delivery.

No cPanel staging access is available. Host PHP/session/Apache/HTTPS behaviour and actual mailbox delivery remain unverified. Upload the ZIP into an isolated staging document root with private files outside every public root, configure confirmed origin/mail/storage/secrets and the private retry cron, then complete staging acceptance using docs/cpanel-deployment.md. Existing live WordPress and mail DNS remain untouched; no primary-domain cutover is authorised.

## Source review and other deliverables

The attached master prompt is preserved byte-for-byte. Nine original Drive audits were read and reconciled. A separate Google Docs export returned 403; the attachment remains the source document. The old WordPress site was archived across 44 sitemap URLs with Chromium rendering and TLS-verified curl mediation (one rendered archive route returned transient 503). Its media API yielded 190 records; 100 recent originals were downloaded privately and visually classified. The HTTP archive is not a full WordPress/database backup.

20 competitor homepages were requested: 19 HTTP 200 and one challenge/403; two JavaScript shells need deeper rendered review. Homepage observations do not establish credentials, spending or conversion performance. Google Ads Transparency returned an application shell without advertiser evidence.

Migration/evidence/asset/competitor inventories, paused campaign packs, a Google Business Profile plan, social drafts and templates remain committed planning deliverables. Optional tracking is disabled. No advertising spend, social publication, account configuration, Google/Meta deployment or messages have occurred.

## Validation and launch boundaries

Required build, HTML, metadata/link/content, lint, unit/PHP and browser checks are recorded in docs/qa-log.md for this revision. Browser photo assertions cover every photographed route, all 16 portfolio images and fully decoded screenshots at six viewport sizes. The image pipeline test verifies reuse after deleting the private original. GitHub repository-prefix asset checks and mobile Lighthouse results are recorded separately; deliberate preview noindex explains the SEO warning.

Production remains gated on confirmed contact/monitored email, business/legal review, data retention/providers and permissions. Before any later authorised cutover, take a private WordPress backup and verify restore; preserve MX/SPF/DKIM/DMARC. The cloud setup/start configuration targets cPanel packaging and PHP tests. Obsolete Cloudflare credential declarations are unused; the available configuration API cannot delete them.

Completed releases must be committed, pushed to main and verified against git ls-remote. Local development servers and screenshots are verification evidence, not public deployment claims.
