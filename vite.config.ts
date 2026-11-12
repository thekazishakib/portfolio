import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';

function cleanUrlsPreviewPlugin(): Plugin {
  return {
    name: 'clean-urls-preview',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) return next();
        const [rawPath, queryString] = req.url.split('?');
        const urlPath = rawPath.split('#')[0];
        if (urlPath === '/admin' || urlPath === '/admin/') {
          req.url = queryString ? `/admin/index.html?${queryString}` : '/admin/index.html';
        }
        next();
      });
    },
    configurePreviewServer(server) {
      const distDir = path.resolve(__dirname, 'dist');
      server.middlewares.use((req, res, next) => {
        if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) return next();
        const [rawPath, queryString] = req.url.split('?');
        const urlPath = rawPath.split('#')[0];

        // Let asset and file requests with extensions pass through to static handler
        if (path.posix.extname(urlPath)) return next();

        // Enforce trailingSlash: false (redirect /about/ -> /about)
        if (urlPath !== '/' && urlPath.endsWith('/')) {
          const cleanPath = urlPath.replace(/\/+$/, '') || '/';
          const location = queryString ? `${cleanPath}?${queryString}` : cleanPath;
          res.statusCode = 308;
          res.setHeader('Location', location);
          res.end();
          return;
        }

        if (urlPath === '/articles') {
          res.statusCode = 308;
          res.setHeader('Location', '/publication');
          res.end();
          return;
        }

        const candidate =
          urlPath === '/'
            ? path.join(distDir, 'index.html')
            : path.join(distDir, urlPath.replace(/^\/+|\/+$/g, ''), 'index.html');

        if (fs.existsSync(candidate)) {
          req.url =
            urlPath === '/'
              ? '/index.html'
              : `/${urlPath.replace(/^\/+|\/+$/g, '')}/index.html`;
          return next();
        }

        const notFoundFile = path.join(distDir, '404.html');
        if (fs.existsSync(notFoundFile)) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(fs.readFileSync(notFoundFile, 'utf8'));
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(({ command, mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawSiteUrl = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || '').trim();

  if (command === 'build') {
    if (!rawSiteUrl || /todo/i.test(rawSiteUrl)) {
      throw new Error(
        'Production build failed: VITE_SITE_URL is unset or contains "TODO". Set VITE_SITE_URL to your production domain (e.g. https://kazishakib.com).'
      );
    }
  } else if (!rawSiteUrl || /todo/i.test(rawSiteUrl)) {
    console.warn(
      '[SEO] VITE_SITE_URL is unset or contains "TODO"; falling back to https://TODO-SET-DOMAIN in dev mode.'
    );
  }

  return {
    plugins: [react(), tailwindcss(), cleanUrlsPreviewPlugin()],
    resolve: { alias: { '@': path.resolve(__dirname, '.') } },
    ...(!isSsrBuild
      ? {
          build: {
            rollupOptions: {
              input: {
                index: path.resolve(__dirname, 'index.html'),
                admin: path.resolve(__dirname, 'admin/index.html'),
              },
            },
          },
        }
      : {}),
    server: {
      watch: {
        ignored: ['**/serp-previews/**', '**/dist-ssr/**'],
      },
    },
  };
});
