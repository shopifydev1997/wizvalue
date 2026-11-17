import type React from 'react';

export const ASSET_ROOT_PATH = '/assets/';
export const DEFAULT_PRODUCT_IMAGE = '/assets/products/Orange Wet Wipes.jpg';
export const DEFAULT_BRAND_LOGO = '/assets/WiZ-Logo-NEW-1.png';

const KNOWN_APP_ROUTES = new Set([
  'shop',
  'category',
  'product',
  'cart',
  'checkout',
  'order-confirmation',
  'bulk-order',
  'offers',
  'advisor',
  'about',
  'contact',
  'faqs',
  'privacy-policy',
  'terms',
  'shipping-policy',
  'returns-policy',
  'search',
  'blog',
  'admin',
  'docs',
  '404',
  '404.html',
  'index.html'
]);

/**
 * Returns true if the URL is an external protocol, protocol-relative URL, or inline data/blob URI.
 */
export function isExternalOrInlineAsset(url: string): boolean {
  return /^(https?:|\/\/|data:|blob:)/i.test(url.trim());
}

/**
 * Standardizes any local asset path to a canonical `/assets/...` path.
 * Preserves external URLs (`http://`, `https://`, `//`) and `data:` / `blob:` URIs.
 *
 * Examples:
 * - `public/assets/products/handwash.jpg` -> `/assets/products/handwash.jpg`
 * - `./assets/WiZ-Logo-NEW-1.png`        -> `/assets/WiZ-Logo-NEW-1.png`
 * - `/my-repo/assets/Blog01.jpg`         -> `/assets/Blog01.jpg`
 * - `products/Lemon-Handwash01.jpg`      -> `/assets/products/Lemon-Handwash01.jpg`
 */
export function normalizeAssetPath(url?: string | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  if (isExternalOrInlineAsset(trimmed)) {
    return trimmed;
  }

  let clean = trimmed.replace(/\\/g, '/').replace(/\/+/g, '/');

  const assetsMarkerIdx = clean.toLowerCase().indexOf('assets/');
  if (assetsMarkerIdx !== -1) {
    clean = clean.slice(assetsMarkerIdx + 'assets/'.length);
  } else {
    clean = clean
      .replace(/^(\/?public\/)/i, '')
      .replace(/^(\.\/|\/)+/, '');
    if (clean.toLowerCase() === 'assets') {
      return ASSET_ROOT_PATH;
    }
    if (clean.toLowerCase().startsWith('assets/')) {
      clean = clean.slice('assets/'.length);
    }
  }

  clean = clean.replace(/^\/+/, '');
  return clean ? `${ASSET_ROOT_PATH}${clean}` : '';
}

/**
 * Normalizes brand logo URLs, replacing deprecated logo references with the canonical logo path.
 */
export function normalizeBrandLogoPath(logo?: string | null): string {
  if (!logo || !logo.trim()) return DEFAULT_BRAND_LOGO;
  if (logo.includes('WiZ-Logo-NEW.png') || logo.includes('wiz-footer-logo-extracted')) {
    return DEFAULT_BRAND_LOGO;
  }
  return normalizeAssetPath(logo) || DEFAULT_BRAND_LOGO;
}

/**
 * Determines the active deployment base prefix (supporting local dev, custom domains,
 * `/dist-static/` previews, and GitHub Pages `/<repo>/` subpaths).
 */
export function getAssetBasePrefix(): string {
  const viteBase = import.meta.env.BASE_URL || '/';

  if (typeof window !== 'undefined') {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const distIdx = segments.indexOf('dist-static');

    if (distIdx !== -1) {
      return `/${segments.slice(0, distIdx + 1).join('/')}/`;
    }

    if (viteBase && viteBase !== './' && viteBase !== '.' && viteBase !== '/') {
      const normalized = `/${viteBase.replace(/^\/+|\/+$/g, '')}/`;
      return normalized;
    }

    if (window.location.hostname.endsWith('github.io') && segments.length > 0) {
      const firstSeg = segments[0];
      if (firstSeg !== 'assets' && !KNOWN_APP_ROUTES.has(firstSeg.toLowerCase())) {
        return `/${firstSeg}/`;
      }
    }
  }

  if (viteBase === './' || viteBase === '.' || viteBase === '/') {
    return '/';
  }

  return `/${viteBase.replace(/^\/+|\/+$/g, '')}/`;
}

/**
 * Resolves any image/media asset path into a browser-ready URL by first standardizing
 * local paths to `/assets/...` and then prefixing the active base path for GitHub Pages
 * and root hosting compatibility.
 */
export function getImageAssetUrl(url?: string | null, fallback?: string): string {
  const raw = url?.trim();
  if (!raw) {
    return fallback ? getImageAssetUrl(fallback) : '';
  }

  if (isExternalOrInlineAsset(raw)) {
    return raw;
  }

  const canonical = normalizeAssetPath(raw);
  if (!canonical) {
    return fallback ? getImageAssetUrl(fallback) : '';
  }

  const relativeToAssets = canonical.slice(ASSET_ROOT_PATH.length);
  const encodedClean = relativeToAssets
    .split('/')
    .filter(Boolean)
    .map((seg) => {
      try {
        return encodeURI(decodeURI(seg));
      } catch {
        return encodeURI(seg);
      }
    })
    .join('/');

  return `${getAssetBasePrefix()}assets/${encodedClean}`;
}

export const resolveAssetUrl = getImageAssetUrl;
export const resolveImageAsset = getImageAssetUrl;

/**
 * Safe image error fallback handler that retries once with a canonical `/assets/` fallback image.
 */
export function handleImageAssetError(fallbackPath: string = DEFAULT_PRODUCT_IMAGE) {
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (target.dataset.assetFallbackApplied) return;
    target.dataset.assetFallbackApplied = 'true';
    const resolvedFallback = getImageAssetUrl(fallbackPath);
    if (resolvedFallback && target.getAttribute('src') !== resolvedFallback) {
      target.setAttribute('src', resolvedFallback);
    }
  };
}
