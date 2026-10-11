/**
 * 为 Markdown 渲染出的 HTML 中的根绝对路径补上 base 前缀。
 *
 * 背景：站点部署在 https://<user>.github.io/<repo>/ 这类子路径下，
 * Markdown 里写 `![合影](/images/a.jpg)` 渲染后会指向域名根目录，
 * 导致图片 404。Astro 的 base 只处理内部链接，不处理 Markdown 内容里的 URL。
 *
 * base 由 astro.config.mjs 注入，不在此处读取 import.meta.env
 * （本文件运行在 Node 配置阶段，拿不到 Vite 的 env）。
 */

/** 需要补 base 的属性 */
const URL_ATTRS = new Set(['src', 'href', 'poster', 'data-src']);

export function rehypeBasePaths(base) {
  const prefix = (base || '/').replace(/\/+$/, '');

  if (!prefix) {
    return () => {};
  }

  const withBase = (pathname) => {
    const value = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return `${prefix}${value}`.replace(/\/{2,}/g, '/');
  };

  return (tree) => {
    visit(tree, 'element', (node) => {
      for (const attr of URL_ATTRS) {
        const value = node.properties?.[attr];
        if (typeof value !== 'string') continue;

        // 只处理本站根绝对路径：/xxx，且不是协议相对 //xxx
        if (!value.startsWith('/') || value.startsWith('//')) continue;

        node.properties[attr] = withBase(value);
      }
    });
  };
}

/**
 * 极简 AST 遍历，避免为一个小功能引入额外依赖。
 * 节点形状参考 hast：{ type, tagName, properties, children }
 */
function visit(node, type, visitor) {
  if (!node || typeof node !== 'object') return;
  if (node.type === type && node.properties) visitor(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) visit(child, type, visitor);
  }
}