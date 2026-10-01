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
