# Development and release runbook — cPanel

The user's cPanel instruction overrides the attached master prompt's default hosting choice. Read docs/cpanel-deployment.md for the deployment package, private layout and staging checks. Cloudflare and GitHub Pages are not deployment requirements.

Use this checkout and Node 24. Run npm ci --ignore-scripts, bash scripts/setup-php.sh, npm run package:cpanel, npm run check, npm run lint, npm run audit:html, npm run test:unit and npm test. The PHP test bootstrap validates an existing PHP 8.2+ runtime or extracts SHA-256-verified Debian 13 amd64 packages into /workspace/.tools without changing system files. CI provisions PHP with PDO SQLite and fileinfo. The cPanel host still needs its own extension verification; a local runtime does not prove the host's configuration.

npm run dev starts the local static preview; it is not a public preview. Tests exercise PHP separately with a temporary private database/storage/config and localhost HTTP session transport. Test fixtures are synthetic and removed afterwards. Actual staging HTTPS, Apache rules and recipient mailbox delivery remain to be verified with account access.

npm run package:cpanel builds the noindex preview and writes releases/regardin-cpanel-preview.zip plus its SHA-256. The archive includes only public site assets, PHP code and an unconfigured private config example. It excludes runtime secrets, uploaded customer data, research originals, the earlier Cloudflare functions and its _headers/_redirects files. Do not upload private into a web-accessible directory. Use a new staging document root; preserve the live WordPress installation and all mail DNS records.

Online enquiry readiness needs PHP sessions, PDO SQLite, fileinfo, writable private storage, exact HTTPS origin, independently generated signing/operator secrets and confirmed sender/recipient. Unconfigured accounts fail closed. mail() handoff is not mailbox receipt. Configure the private cron, inspect queued/review notifications and verify actual delivery before launch. Native HTML submissions and JavaScript enhancement share validation/storage; direct thank-you visits do not show a stored receipt.

Production approvals remain separate. Resolve contact/photo/brand/legal confirmations, take an authorised WordPress backup and test restoration, review backlinks/retired URLs, verify the production build and Apache indexing/security configuration, then perform only an explicitly approved cutover. No deployment or cutover has occurred.
