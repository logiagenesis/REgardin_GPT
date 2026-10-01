# cPanel deployment — user-confirmed target

The user's explicit cPanel instruction overrides the Cloudflare default in the attached document. No Cloudflare or GitHub Pages deployment is required or authorised. No cPanel access, staging hostname, PHP extension list or mailbox delivery is currently available to this environment; they are not guessed.

## Deliverable

Run `npm run package:cpanel`. The committed archive `releases/regardin-cpanel-preview.zip` contains `public_html/`, `private/` and these instructions. Verify its SHA-256 against the adjacent checksum file. The archive is a noindex staging build; it contains no secret values or original research/photo files. Node is needed only to build locally, not on cPanel.

Create an isolated staging subdomain in cPanel with its own document root. Extract the public_html contents into that root, and keep private as a sibling outside every public document root. The package name public_html is illustrative directory structure, not an instruction to overwrite the existing live public_html. Preserve the existing WordPress installation, account settings and mail DNS. Use cPanel Directory Privacy for restricted review if appropriate.

PHP 8.2 or newer, PDO SQLite and fileinfo are required for online enquiries. Check them in cPanel's PHP selector or with the hosting provider. If those extensions are unavailable, online submission remains disabled; the static website and call/email fallback still work. Do not silently switch database or hosting products. Apache requires mod_rewrite and mod_headers with AllowOverride enabled. Verify actual 301, 410, 404, header and HTTPS behaviour on staging; the PHP development router does not verify Apache configuration.

## Server configuration

Copy private/config.example.php to private/config.php. Confirm the exact HTTPS staging origin, monitored recipient and authenticated sender. Generate independent random signing and operator secrets with PHP random_bytes; do not paste them into chat or Git. Create private/storage with mode 0700, owned by the PHP account. Database and upload files use 0600. Set enabled=true only when those checks pass. REGARDIN_PRIVATE and REGARDIN_CONFIG may override private-directory/config locations through account-level server configuration, never public query parameters.

Online submission uses PHP sessions/CSRF, an empty honeypot, same-origin checks, per-IP keyed rate limits, server validation and fileinfo MIME detection. Five files maximum, eight MB each. Set PHP upload_max_filesize=8M and post_max_size=42M through MultiPHP INI Editor; check web-server request limits too. Excessive limits or unavailable disk space must be addressed before enabling uploads. Protect the staging origin with TLS before testing secure session cookies. Bot-control effectiveness requires review against real traffic; no CAPTCHA vendor or effectiveness guarantee is invented.

Enquiries and the notification outbox are stored transactionally in private SQLite before files or mail are attempted. Exact duplicate requests return the prior receipt; conflicting payloads are rejected. Upload failures retain the enquiry and report incomplete attachments. Attachment downloads require HMAC links expiring after 15 minutes; authorised renewal uses POST /api/attachments/links with a private Bearer operator token. No operator token is bundled into JavaScript.

Notifications use the confirmed cPanel local mail transport, not a Cloudflare/email API dependency. mail() success proves only handoff to the local mail system. Verify the sender's authenticated delivery and actual recipient mailbox receipt on staging before launch; do not change MX/SPF/DKIM/DMARC as part of this package upload. Cron every five minutes: `/absolute/path/to/php /absolute/path/to/private/cron.php`. Use cPanel's actual PHP executable and paths. Failed handoff queues retry. An interrupted handoff moves to review rather than automatically repeating a potentially sent email; inspect the mail log before resetting it. Configure cron monitoring and storage/mail retention with the owner.

## Staging acceptance and launch

Test synthetic enquiries with and without JavaScript, invalid fields, invalid/oversized uploads, duplicates, safe attachment links/expiry, mail failure/retry and actual mailbox delivery. Never use real customer data for QA. Inspect the 22 routes, fonts, mobile layout, keyboard navigation, all five redirects, every retired demo path, 404 and noindex response headers.

Photograph/context permissions, contact/brand confirmation and legal/data-retention review remain separate launch requirements. Keep staging noindex. The package script always builds a preview; production must use the approval-gated production build and a reviewed Apache configuration that removes preview noindex only after approval. Back up and verify restore of the live WordPress site before any authorised cutover. No cutover was performed.
