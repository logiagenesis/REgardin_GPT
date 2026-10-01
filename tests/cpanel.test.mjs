import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const php =
  process.env.PHP_BIN ||
  (existsSync('/workspace/.tools/php/php') ? '/workspace/.tools/php/php' : 'php');
test('cPanel PHP files pass syntax validation', () => {
  const walk = (path) =>
    readdirSync(path, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory()
        ? walk(`${path}/${e.name}`)
        : e.name.endsWith('.php')
          ? [`${path}/${e.name}`]
          : [],
    );
  for (const file of walk('hosting/cpanel')) {
    const r = spawnSync(php, ['-l', file], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr || r.stdout || r.error?.message);
  }
});
test('cPanel durable enquiry and private access controls use real PHP and SQLite', () => {
  const r = spawnSync(php, ['tests/cpanel.php'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr || r.stdout || r.error?.message);
  assert.match(r.stdout, /PASS PHP/);
});

test('cPanel native HTML and multipart HTTP submission persist receipts and preserve errors', () => {
  const r = spawnSync(process.execPath, ['tests/cpanel-http.mjs'], {
    encoding: 'utf8',
    env: { ...process.env, PHP_BIN: php },
    timeout: 30000,
  });
  assert.equal(r.status, 0, r.stderr || r.stdout || r.error?.message);
  assert.match(r.stdout, /PASS: real PHP HTTP/);
});
