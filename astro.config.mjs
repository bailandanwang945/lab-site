import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeBasePaths } from './scripts/rehype-base-paths.mjs';

// 静态配置对象（此前函数式 defineConfig(({mode}) => …) 在本环境无法把
// integrations 传入 Astro，导致 sitemap 集成不生效；改为静态对象后正常）。
// dev（NODE_ENV !== 'production'）挂在根路径，生产构建挂在 /lab-site 子路径。
const PROD_SITE = 'https://mjcui.github.io/lab-site/';
const site = process.env.PUBLIC_SITE_URL || PROD_SITE;
const isProd = process.env.NODE_ENV === 'production';
const base = isProd ? new URL(site).pathname.replace(/\/+$/, '') || '/' : '/';

export default defineConfig({
  site,
  // GitHub Pages 项目仓库部署在子路径下（/<repo>/），必须设置 base，否则站内
  // 链接与静态资源都会指向域名根目录。从站点地址的 pathname 推导。
  base,
  trailingSlash: 'always',
  // 生成 sitemap-index.xml / sitemap-0.xml，自动收录中英文全部页面
  // （base 下的每套 URL 都会写入，双语站无需额外配置）。
  integrations: [sitemap()],
  markdown: {
    // Markdown 内容里的 /images/... 不会自动补 base，需自行改写
    rehypePlugins: [[rehypeBasePaths, base]],
  },
});
