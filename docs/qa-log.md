# QA log — 01/10/2026

## First site draft

- Preview build: passed, 21 routes, Vite 8.3.1 / Node 24.19.0; no build errors or warnings.
- ESLint, Stylelint and Prettier: passed.
- html-validate: passed across all 21 built pages.
- Internal-link and content gate: passed; 21 routes, valid metadata lengths, one H1 each, no dead hash CTAs or banned content.
- Playwright: 30 tests passed; all 21 routes checked with axe (zero violations), six responsive screenshots, keyboard menu, clipboard brief and privacy/status behaviour.
- Screenshots at 360, 390, 768, 1024, 1440 and 1920 px: generated; desktop, tablet and mobile views inspected. No horizontal overflow in the checks.
- Lighthouse mobile: home 93 performance / 100 accessibility / 100 best practices / 66 SEO; contact 99 / 100 / 96 / 66; renovation service 100 / 100 / 100 / 66. The sole failing SEO audit is crawlability: preview robots.txt and noindex deliberately block indexing. Production SEO is not claimed.
- Fault classes fixed before push: overlong description, raw ampersands, invalid service-row nesting, figcaption ordering, implicit control types, phone wrapping, missing preview landmark, skipped heading levels. Initial browser configuration was corrected to use installed system Chromium after download was blocked.
- Source checks: supplied document only; fresh live-site and Drive retrieval blocked by proxy 403. No fresh scrape or unavailable audit claimed.

## Remaining checks

Live preview, production deployment and delivered-mail verification are unrun; they require account configuration. Online submission is disabled in this draft. The production approval gate remains active.

## Enquiry backend

- 13 tests passed against real SQLite tables using the shipped migration. External Turnstile/R2/mail boundary failures are simulated; no live delivery claim.
- Cloudflare Functions build passed in Wrangler 4.145.0.
- Local Pages runtime: GET /api/enquiries reports disabled without credentials; POST returns 503; /our-team/ returns 301; /portfolios/ returns 410.
- Browser recheck: 30 passed after receipt/upload-status handling.
- Live-site and Drive HTTP access now works after the earlier proxy denial. Nine prior-audit files retrieved into ignored research storage. Archive and detailed reconciliation are in progress.

- Backend push audit: build, lint, HTML, internal links, 30 browser checks and 13 SQL/API checks pass. Lighthouse rerun passes required performance/accessibility/best-practice thresholds; preview crawlability remains the expected SEO warning.
- A direct Lighthouse CLI attempt failed because Chromium was launched without headless mode; the configured Lighthouse CI runner was rerun successfully. No result from the failed run is used.

## Source, project and integration release

- 22-route build, lint, HTML and metadata/internal-link/content checks pass. All 33 browser tests passed before the font change. A subsequent run hit a Vite reload during axe evaluation while generated files were being updated: 32 passed, one execution-context interruption. A clean rerun is required and recorded below; no accessibility assertion was bypassed.
- 18 unit checks include real SQLite schema, signed-link expiry/tampering, operator authorisation, safe downloads, approved-only responsive image processing, notification/upload race and interrupted-upload recovery. External providers are test doubles; account delivery remains unverified.
- Final Lighthouse scores: home 100/100/100/66, contact 100/100/96/66, renovations 100/100/100/66, project layout 99/100/100/66. Order: performance/accessibility/best practices/SEO. Required local thresholds pass; preview crawlability warning remains intentionally visible.
- Performance defect: homepage late font load caused CLS 0.225 and performance 88. Self-hosted critical-font preload reduces CLS to 0 and performance rises to 100. Project template CLS 0.071 remains below 0.1.
- Backend defects corrected: undersized signing/operator keys no longer count as configured; notification waits for uploads and marks interrupted uploads incomplete after five minutes instead of prematurely emailing without links.
- Cloudflare Functions bundle compiled successfully. Production build correctly fails on missing contact/photo/legal approvals. Wrangler identity operation reports unauthenticated. No public-host, mailbox, Google account or production result claimed.
- Setup script npm ci --ignore-scripts/build/check executed successfully. Dependency installation reports upstream dev-tool deprecations; Vite build has no warnings. Saved setup/start configuration and credential requirements confirmed by configuration tool.
- Sources: 44 old URLs archived/rendered (one rendered 503), 100 original media downloads reviewed, nine audits read, 20 raw competitor homepage responses checked (one 403, two JS shells). Source certificate handling used verified curl mediation; TLS was not disabled.
- GitHub Actions added; its actual remote result remains to be inspected after push. Launch blockers and unmet JS-free form/photo-led/share-preview requirements are explicit in HANDOVER.md.

- Clean browser rerun after generated-file writes completed: 33 passed, zero axe violations. Final unit suite: 18 passed. Font-face spacing lint corrections are formatting only; no assertion settings were relaxed.

- Linkinator 8.1.0 scanned the built preview with recursion, CSS URLs and fragment validation: 34 links, zero broken. External origins excluded from this local scan; external/account checks retain their separate status.

## cPanel correction — 01/10/2026

- Explicit user cPanel instruction supersedes the attached master prompt's default host. No GitHub Pages/Cloudflare deployment was performed.
- Built 22-route cPanel ZIP with Apache 301/410/404/security/noindex configuration. Private database/uploads/config stay outside public_html. Zip omits legacy Cloudflare runtime and secrets.
- PHP 8.4.24 extracted from official Debian packages after SHA-256 verification. All eight PHP source files pass syntax validation. Three PHP regression checks pass: syntax; actual SQLite/private configuration/idempotency/rate limits/link expiry/retry; actual HTTP session/multipart upload, duplicate receipts, native HTML POST and escaped error restoration.
- Initial HTTP verification failed because the local PHP runtime's compiled session directory was unwritable. Configured a private temporary session directory for local tests; host session permissions must be checked on staging. Receipt callback used preg_replace with a closure; corrected to preg_replace_callback, then the HTTP receipt test passed. A Vite development pre-transform error was also corrected by emitting its absolute allowed module path.
- Native mail handoff is controlled in unit tests; local HTTP tests retain queued notifications when the test machine has no sendmail. No recipient mailbox delivery claimed. Interrupted native-mail handoffs require operator review rather than automatic resend.
- Browser regression before the Vite-path correction: 33 passed. Clean rerun and final mobile Lighthouse results follow. Actual Apache/cPanel/HTTPS/mail acceptance remains blocked by missing staging access, not by Cloudflare authentication.

- Final cPanel correction retest: lint, 22-route build/HTML/content gates, all 33 browser checks and all 21 unit/integration checks pass. No Vite pre-transform errors remain. Linkinator: 34 local links, zero broken. Archive inspection confirms no runtime config, customer storage or Cloudflare deployment files. SHA-256 is committed beside the ZIP.
- Latest mobile Lighthouse: home 100/100/100/66; contact 99/100/96/66; renovations 100/100/100/66; project template 99/100/100/66 (performance/accessibility/best practices/SEO). Preview noindex warning remains visible. No real cPanel server, public-host or mailbox result is claimed.
- Cloud environment install/start draft was saved with cPanel/PHP packaging instructions. Local PHP bootstrap and packaging commands were executed successfully. Existing Cloudflare credential declarations are obsolete and unused; the available configuration API cannot delete declarations.

## GitHub Pages preview correction

- User screenshot showed Pages set to GitHub Actions but no deployment. Added a real build/upload/deploy workflow; cPanel remains the full PHP host.
- Repository-base build, HTML validation and link/content gate pass for all 22 routes. Chromium checked every prefixed route with axe, local asset responses and navigation prefixes: zero violations, page errors or HTTP failures. Static contact fallback is visible and online submission stays hidden. The first local axe harness required an explicit browser context; corrected the harness and reran successfully.
- Backend fetch is compiled out of the static preview. cPanel package explicitly builds with root base and PHP-enabled configuration. No production domain/cPanel cutover is performed.
- Direct Actions API and public-preview HTTP inspection remain denied by the network proxy (CONNECT 403). Workflow and deployment status will not be described as successful without evidence.

## Photographic construction rebuild — 01/10/2026

- Replaced concept artwork and the empty portfolio with 16 selected source-site photographs and the original logo. A dedicated copywriter rewrote home/about/service/portfolio/process/contact content using archived source facts; testimonial wording is preserved.
- Root-path cPanel package: 22-route build, HTML validation, metadata/internal-link/content gates and lint pass. All 21 unit/PHP/integration checks pass. The image test proves that a fresh build can reuse committed derivatives after the private original is removed.
- All 34 browser checks pass with zero axe violations and page errors. Photographs decode successfully on every photographed route; the portfolio contains all 16. Full-page screenshot checks now explicitly load every lazy image at 360, 390, 768, 1024, 1440 and 1920 widths. Committed screenshots show actual loaded images.
- First mobile Lighthouse run passed category thresholds but revealed CLS 0.144 on service/gallery pages. The JS-free mobile menu initially appeared before module startup. Added a same-origin blocking boot script to set the enhancement class before first paint while preserving real no-JS navigation; reran the browser suite and Lighthouse.
- Final mobile scores (performance/accessibility/best practices/SEO): home 100/100/100/69; contact 100/100/96/69; renovations 100/100/100/69; construction gallery 100/100/100/69. CLS is 0 on all four. Preview noindex remains deliberate; production SEO is not claimed.
- Repository-prefixed Chromium checks passed for all 22 routes and 70 image derivatives/OG assets, with every srcset correctly prefixed and zero axe violations, page errors or HTTP failures. Static contact submission remains disabled. The latest Pages deploy is inspected independently after push; direct public-preview HTTP remains blocked by the environment proxy. cPanel host/mail verification still requires staging access.
