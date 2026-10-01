import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'vite';
import { routes, render } from '../src/render.js';
import tracking from '../src/data/tracking.json' with { type: 'json' };
import business from '../src/data/business.json' with { type: 'json' };
const mode = process.env.SITE_MODE || 'preview';
const base = process.env.SITE_BASE || '/';
if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(base)) throw new Error('Invalid SITE_BASE.');
if (
  mode === 'production' &&
  (!business.contactApproved || !business.photographyApproved || !business.legalApproved)
)
  throw new Error(
    'Production blocked: contact, photography and legal approval are required. Use npm run build for the design preview.',
  );
await rm('.generated', { recursive: true, force: true });
for (const r of routes) {
  const path = resolve(
    '.generated',
    r.path === '/'
      ? 'index.html'
      : r.path.endsWith('.html')
        ? r.path.slice(1)
        : r.path.slice(1) + 'index.html',
  );
  await mkdir(resolve(path, '..'), { recursive: true });
  await writeFile(path, render(r, mode));
}
await build();
await writeFile(
  'dist/robots.txt',
  mode === 'production'
    ? 'User-agent: *\nAllow: /\nSitemap: ' + business.url + '/sitemap.xml\n'
    : 'User-agent: *\nDisallow: /\n',
);
await writeFile(
  'dist/sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    routes
      .filter((r) => !r.noindex && !['privacy', 'terms'].includes(r.kind))
      .map((r) => `<url><loc>${business.url}${r.path}</loc></url>`)
      .join('') +
    '</urlset>',
);
const analytics =
  mode === 'production' && tracking.approved && /^GTM-[A-Z0-9]+$/.test(tracking.gtmId || '');
await writeFile(
  'dist/_headers',
  `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; script-src 'self' https://challenges.cloudflare.com${analytics ? ' https://www.googletagmanager.com' : ''}; style-src 'self' 'unsafe-inline'; img-src 'self' data:${analytics ? ' https://www.google-analytics.com' : ''}; font-src 'self'; connect-src 'self'${analytics ? ' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com' : ''}; frame-src https://challenges.cloudflare.com; form-action 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'\n${mode === 'production' ? '' : '  X-Robots-Tag: noindex, nofollow\n'}`,
);
if (mode === 'production') {
  for (const r of routes) {
    const p =
      'dist/' +
      (r.path === '/'
        ? 'index.html'
        : r.path.endsWith('.html')
          ? r.path.slice(1)
          : r.path.slice(1) + 'index.html');
    if ((await readFile(p, 'utf8')).includes('[CONFIRM'))
      throw new Error('Production contains unconfirmed content: ' + r.path);
  }
}
if (base !== '/') {
  for (const route of routes) {
    const file =
      'dist/' +
      (route.path === '/'
        ? 'index.html'
        : route.path.endsWith('.html')
          ? route.path.slice(1)
          : route.path.slice(1) + 'index.html');
    const html = (await readFile(file, 'utf8')).replace(
      /(\b(?:href|src|action)=")\/(?!\/)([^"]*)/g,
      (match, prefix, path) => (path.startsWith(base.slice(1)) ? match : prefix + base + path),
    );
    await writeFile(file, html);
  }
}
await writeFile('dist/.nojekyll', '');
console.log(
  `Built ${routes.length} routes in ${mode} mode. Production release remains approval-gated.`,
);
