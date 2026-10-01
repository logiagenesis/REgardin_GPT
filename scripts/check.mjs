import { readFile, stat } from 'node:fs/promises';
import { routes } from '../src/render.js';
const errors = [];
for (const r of routes) {
  const filename =
    'dist/' +
    (r.path === '/'
      ? 'index.html'
      : r.path.endsWith('.html')
        ? r.path.slice(1)
        : r.path.slice(1) + 'index.html');
  const html = await readFile(filename, 'utf8');
  if ((html.match(/<h1[ >]/g) || []).length !== 1) errors.push(r.path + ': expected one H1');
  if (r.title.length > 60)
    errors.push(r.path + ': title exceeds 60 characters (' + r.title.length + ')');
  if (r.description.length > 155)
    errors.push(r.path + ': description exceeds 155 characters (' + r.description.length + ')');
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (href === '#') {
      errors.push(r.path + ': dead link');
      continue;
    }
    if (!href.startsWith('/')) continue;
    const path = href.split(/[?#]/)[0];
    if (path === '#main' || !path) continue;
    const target =
      'dist/' +
      (path === '/'
        ? 'index.html'
        : path.endsWith('/')
          ? path.slice(1) + 'index.html'
          : path.slice(1));
    try {
      await stat(target);
    } catch {
      errors.push(r.path + ': missing target ' + path);
    }
  }
  const banned =
    /lorem|ipsum|Steven Monroe|Michael King|Johnson Group|efinance|surielementor|themeforest|Finanve|Floorscreeed|Carpentery|seamless|dream home|top-notch|look no further|exceed your expectations|no project too big|one-stop|world-class|unmatched|flawless/i;
  if (banned.test(html)) errors.push(r.path + ': banned content');
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `PASS: ${routes.length} built routes, metadata, internal links, one H1 per page and banned-content gate.`,
);
