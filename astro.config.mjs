import { defineConfig } from 'astro/config';
import { resolveConfiguredSiteUrl, resolveConfiguredBasePath } from './scripts/site-url.mjs';
import { rehypeBasePaths } from './scripts/rehype-base-paths.mjs';

export default defineConfig(({ mode }) => {
  const site = resolveConfiguredSiteUrl(mode);
  const base = resolveConfiguredBasePath(mode);

  return {
    site,
    // GitHub Pages 项目仓库部署在子路径下（/<repo>/），
    // 必须设置 base，否则站内链接会指向域名根目录。
    // 从站点地址的 pathname 自动推导，避免手工维护两处。
    base,
    trailingSlash: 'always',
    markdown: {
      // Markdown 内容里的 /images/... 不会自动补 base，需自行改写
      rehypePlugins: [[rehypeBasePaths, base]],
    },
  };
});