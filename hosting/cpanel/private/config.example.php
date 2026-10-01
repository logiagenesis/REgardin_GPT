<?php
// Copy to config.php in a directory OUTSIDE the web document root.
return [
    'enabled' => false,
    'origin' => '', // Exact HTTPS staging origin; no trailing slash.
    'storage' => __DIR__ . '/storage', // Must remain outside every public document root.
    'secret' => '', // Generate with: php -r 'echo bin2hex(random_bytes(32)), PHP_EOL;'
    'operator_token' => '', // Generate independently; never send to a browser.
    'from_email' => '', // Confirm an authenticated cPanel sender.
    'notification_email' => '', // Confirm the monitored recipient mailbox.
];
