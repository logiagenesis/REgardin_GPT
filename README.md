# Regardin Construction

A static, multi-page website for Regardin Construction in Cape Town. Built with HTML, hand-written CSS and progressive vanilla JavaScript, compiled by Vite. Target repository: `logiagenesis/REgardin_GPT`.

## Develop

Use Node 24 (minimum 22.12). From this checkout:

```sh
npm ci --ignore-scripts
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

Cloudflare Pages: build command `npm run build`, output directory `dist`, Node version `24`. The GitHub repository is not a public website preview. No Cloudflare account has been connected and no public preview URL exists yet.

Direct contact links and client-side email-brief preparation are available now. Online enquiry submission remains disabled until its storage, abuse-prevention and notification configuration is connected and tested.
