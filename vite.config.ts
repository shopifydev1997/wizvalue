import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

function resolveBasePath(command: 'serve' | 'build'): string {
  const envBase = process.env.VITE_BASE_PATH?.trim();
  if (envBase) {
    if (envBase === './' || envBase === '.') return './';
    const normalized = `/${envBase.replace(/^\/+|\/+$/g, '')}/`.replace(/\/+/g, '/');
    return normalized;
  }

  if (command === 'serve') {
    return '/';
  }

  if (process.env.GITHUB_ACTIONS === 'true' && process.env.GITHUB_REPOSITORY) {
    const repo = process.env.GITHUB_REPOSITORY.split('/')[1] || '';
    if (repo && !repo.endsWith('.github.io') && !fs.existsSync(path.resolve('public/CNAME'))) {
      return `/${repo}/`;
    }
    return '/';
  }

  // Relative base ensures static builds work across root, /dist-static, and subdirectory hosting
  return './';
}

/**
 * Vite plugin for GitHub Pages SPA support:
 * - Serves index.html for all internal routes in dev and preview servers.
 * - Generates dist/404.html directly from the built dist/index.html so GitHub Pages
 *   serves the SPA entry on direct URL access or page refresh without 404 errors.
 * - Preserves internal route paths for HashRouter and fixes relative asset resolution on nested URLs.
 * - Creates .nojekyll so GitHub Pages does not skip static assets.
 */
function githubPagesSpaFallbackPlugin(resolvedBase: string): Plugin {
  const spaRouteSyncScript = `
    <script>
      (function() {
        var loc = window.location;
        var configuredBase = ${JSON.stringify(resolvedBase)};
        var pathname = loc.pathname || '/';
        var segments = pathname.split('/').filter(Boolean);
        var distIdx = segments.indexOf('dist-static');
        var appBase = '/';

        if (distIdx !== -1) {
          appBase = '/' + segments.slice(0, distIdx + 1).join('/') + '/';
        } else if (configuredBase && configuredBase !== './' && configuredBase !== '/') {
          appBase = configuredBase;
        } else if (loc.hostname.endsWith('github.io') && segments.length > 0 && segments[0] !== 'assets') {
          var firstSeg = segments[0];
          var knownRoutes = ['shop','category','product','cart','checkout','order-confirmation','bulk-order','offers','advisor','about','contact','faqs','privacy-policy','terms','shipping-policy','returns-policy','search','blog','admin','docs','404','404.html'];
          if (knownRoutes.indexOf(firstSeg.toLowerCase()) === -1) {
            appBase = '/' + firstSeg + '/';
          }
        }

        // Ensure relative ./assets/... tags always resolve from app root on nested routes
        if (configuredBase === './' && !document.querySelector('base')) {
          var baseEl = document.createElement('base');
          baseEl.href = appBase;
          document.head.insertBefore(baseEl, document.head.firstChild);
        }

        // Convert direct internal pathname (e.g. /repo/category/handwash) into HashRouter URL without page reload
        var routePart = '';
        if (pathname.indexOf(appBase) === 0) {
          routePart = pathname.slice(appBase.length);
        } else if (pathname.charAt(0) === '/') {
          routePart = pathname.slice(1);
        }
        routePart = routePart.replace(/^\\/+|\\/+$/g, '');

        if (routePart && routePart !== 'index.html' && routePart !== '404.html' && routePart !== 'docs' && !loc.hash) {
          var cleanTarget = appBase + '#/' + routePart + (loc.search || '');
          window.history.replaceState(null, '', cleanTarget);
        }
      })();
    </script>`;

  return {
    name: 'github-pages-spa-fallback',
    configureServer(server) {
      return () => {
        server.middlewares.use((req, _res, next) => {
          const reqPath = (req.url || '').split('?')[0];
          if (req.url && !reqPath.includes('.') && !reqPath.startsWith('/api/') && !reqPath.startsWith('/@')) {
            req.url = '/index.html';
          }
          next();
        });
      };
    },
    configurePreviewServer(server) {
      return () => {
        server.middlewares.use((req, _res, next) => {
          const reqPath = (req.url || '').split('?')[0];
          if (req.url && !reqPath.includes('.') && !reqPath.startsWith('/api/')) {
            req.url = '/index.html';
          }
          next();
        });
      };
    },
    closeBundle() {
      const outDir = path.resolve('dist');
      const indexPath = path.join(outDir, 'index.html');
      const notFoundPath = path.join(outDir, '404.html');
      const noJekyllPath = path.join(outDir, '.nojekyll');

      if (!fs.existsSync(indexPath)) return;

      if (!fs.existsSync(noJekyllPath)) {
        fs.writeFileSync(noJekyllPath, '');
      }

      const indexHtml = fs.readFileSync(indexPath, 'utf-8');
      const fallbackHtml = indexHtml.includes('<head>')
        ? indexHtml.replace('<head>', `<head>${spaRouteSyncScript}`)
        : indexHtml;

      fs.writeFileSync(notFoundPath, fallbackHtml, 'utf-8');
    },
  };
}

export default defineConfig(({command}) => {
  const base = resolveBasePath(command);

  return {
    base,
    appType: 'spa',
    plugins: [react(), tailwindcss(), githubPagesSpaFallbackPlugin(base)],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      port: 4173,
    },
  };
});
