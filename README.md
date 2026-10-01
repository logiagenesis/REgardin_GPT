# Regardin Construction

A static, multi-page website for Regardin Construction in Cape Town. Built with HTML, hand-written CSS and progressive vanilla JavaScript, compiled by Vite. Target repository: `logiagenesis/REgardin_GPT`.

## Develop

Use Node 24 (minimum 22.12). PHP 8.2+ with PDO SQLite and fileinfo is used for cPanel enquiry tests. From this checkout:

```sh
npm ci --ignore-scripts
bash scripts/setup-php.sh
npm run package:cpanel
npm run dev
```

The environment already isolates the task: use this checkout; do not create another worktree unless requested.

```sh
npm run build
npm run check
npm run lint
npm run audit:html
npm run test:unit
CHROME_PATH=/usr/bin/chromium npm test
CHROME_PATH=/usr/bin/chromium npm run audit:lighthouse
```

The default build is a **noindex design preview**. `npm run build:production` deliberately fails until the outstanding approvals are resolved. See `HANDOVER.md` and `docs/runbook.md`. Image assets are processed only after explicit approval in `src/data/assets.json`; `npm run images` creates responsive formats and strips metadata. `npm run contact-sheet` produces a private review sheet from the ignored archive.

## Content and architecture

`src/data/` holds business facts, service enquiries, testimonial source text and FAQs. `src/render.js` supplies shared header/footer, route content and metadata through the in-repository Vite HTML plugin. Pages contain their content without JavaScript. Fonts are self-hosted; there are no UI frameworks or slider libraries. Optional consent-based tracking code is disabled; no real third-party tracking scripts load.

The concept drawings are labelled illustrations. They are never presented as completed Regardin projects. No project case studies have been fabricated.

## Deployment

**cPanel is the user-confirmed target.** It overrides the Cloudflare default in the attached document. Run `npm run package:cpanel` and use [the deployment guide](docs/cpanel-deployment.md). The archive and checksum are committed under `releases/`.

The site runs as static HTML/CSS/JS on the host, with PHP for session-verified enquiries, private SQLite storage/uploads and queued local-mail notifications. Node is not needed on cPanel. PHP extension/account configuration and actual mailbox delivery remain unverified. There is no public preview URL yet because this environment has no cPanel staging access.

Upload to an isolated staging document root; keep private files outside every public root. The package stays noindex. Do not replace live WordPress or alter DNS/mail records. GitHub Actions runs QA only; no GitHub Pages or Cloudflare deployment is configured. Earlier Functions/Worker code remains historical source and is excluded from the cPanel package.
