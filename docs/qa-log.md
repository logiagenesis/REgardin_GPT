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
