import { loadEnv } from 'vite';

export const DEFAULT_SITE_URL = 'https://mjcui.github.io/lab-site/';

export function normalizeSiteUrl(value) {
  const raw = `${value || DEFAULT_SITE_URL}`.trim().replace(/^['"]|['"]$/g, '');
  const candidate = /^[a-z][a-z\d+\-.]*:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error(`Unsupported site URL protocol: ${url.protocol}`);
    }

    url.search = '';
    url.hash = '';
    const site = url.toString();
    return site.endsWith('/') ? site : `${site}/`;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function resolveConfiguredSiteUrl(mode = 'production') {
  const env = loadEnv(mode, process.cwd(), '');
  return normalizeSiteUrl(process.env.PUBLIC_SITE_URL || process.env.SITE_URL || env.PUBLIC_SITE_URL || env.SITE_URL);
}

/**
 * 从站点地址推导 Astro 的 base 路径。
 *
 * https://mjcui.github.io/lab-site/  ->  /lab-site
 * https://example.com/                ->  /
 *
 * 部署在 GitHub Pages 项目仓库（子路径）时若不设置 base，
 * 站内链接会指向域名根目录，导致 404。
 */
export function resolveConfiguredBasePath(mode = 'production') {
  const { pathname } = new URL(resolveConfiguredSiteUrl(mode));
  const base = pathname.replace(/\/+$/, '');
  return base === '' ? '/' : base;
}
