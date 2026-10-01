import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { routes, render } from './src/render.js';
const entries = Object.fromEntries(
  routes.map((r, i) => [
    'page' + i,
    resolve(
      '.generated',
      r.path === '/'
        ? 'index.html'
        : r.path.endsWith('.html')
          ? r.path.slice(1)
          : r.path.slice(1) + 'index.html',
    ),
  ]),
);
export default defineConfig({
  root: '.generated',
  base: process.env.SITE_BASE || '/',
  publicDir: resolve('public'),
  build: { outDir: resolve('dist'), emptyOutDir: true, rollupOptions: { input: entries } },
  plugins: [
    {
      name: 'regardin-pages',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const pathname = new URL(req.url, 'http://localhost').pathname;
          if (pathname.startsWith('/api/enquiries')) {
            res.setHeader('Content-Type', 'application/json');
            if (req.method === 'GET') {
              res.end(JSON.stringify({ enabled: false }));
            } else {
              res.statusCode = 503;
              res.end(
                JSON.stringify({
                  error: 'Online enquiries are not connected. Please call or email Regardin.',
                }),
              );
            }
            return;
          }
          if (pathname.startsWith('/src/')) {
            req.url = '/@fs' + resolve(pathname.slice(1));
            return next();
          }
          const route = routes.find((r) => r.path === pathname);
          if (!route) return next();
          try {
            res.setHeader('Content-Type', 'text/html');
            res.end(
              await server.transformIndexHtml(
                pathname,
                render(route).replace('src="/src/main.js"', `src="/@fs${resolve('src/main.js')}"`),
              ),
            );
          } catch (error) {
            next(error);
          }
        });
      },
      transformIndexHtml: {
        order: 'pre',
        handler(html, context) {
          if (context.server) return html;
          const route = routes.find(
            (r) =>
              resolve(
                '.generated',
                r.path === '/'
                  ? 'index.html'
                  : r.path.endsWith('.html')
                    ? r.path.slice(1)
                    : r.path.slice(1) + 'index.html',
              ) === context.filename,
          );
          return route
            ? render(route, process.env.SITE_MODE || 'preview').replace(
                'src="/src/main.js"',
                `src="${resolve('src/main.js')}"`,
              )
            : html;
        },
      },
    },
  ],
  server: { fs: { allow: [resolve('.')] } },
});
