# Project instructions

Use this existing checkout. Cloud tasks are already isolated; do not create a worktree unless the user requests one.

Follow MASTER_PROMPT.md, with logiagenesis/REgardin_GPT as the user-confirmed repository. Keep missing facts in the confirmation register and do not invent projects, reviews, credentials or account completion.

Complete useful work autonomously. Do not repeatedly pause for routine decisions or ask answered questions. Push completed, audited work to main and verify the remote SHA. Never claim a local server is a public preview.

Communication preference explicitly supplied by the user: never tell the user “you’re right” or use that phrase as reassurance. Avoid flattery and patronising agreement. Give factual progress and concrete outcomes.

Use Node 24. Run npm run build, npm run check, npm run lint, npm run audit:html, npm test and npm run test:unit for relevant changes. CHROME_PATH may point to system Chromium; install a verified Playwright Chromium when a system browser is unavailable. Preview SEO crawlability is deliberately blocked, and must remain clearly distinguished from production SEO validation.

Hosting correction from the user: target cPanel/Apache/PHP. This overrides the attached master prompt’s Cloudflare default. Do not deploy through Cloudflare or GitHub Pages. Package the built site for an isolated cPanel staging document root, with server data outside the public directory. Preserve existing live WordPress and mail DNS; no cutover is authorised.
