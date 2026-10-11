#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { resolveConfiguredSiteUrl } from './site-url.mjs';

function readHtml(file) {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing build output: ${file}`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(html, needle, file) {
  if (!html.includes(needle)) {
    throw new Error(`Missing "${needle}" in ${file}`);
  }
}

const siteUrl = resolveConfiguredSiteUrl(process.env.MODE || 'production');
// 站内绝对路径在部署到子路径时必须带 base 前缀，断言需与之保持一致
const base = new URL(siteUrl).pathname.replace(/\/+$/, '');
const withBase = (p) => `${base}${p}`;

const checks = [
  {
    file: 'dist/index.html',
    includes: [
      '<html lang="zh-CN"',
      `<link rel="canonical" href="${siteUrl}">`,
      `<link rel="alternate" hreflang="en" href="${siteUrl}en/">`,
      `<meta property="og:url" content="${siteUrl}">`,
      `href="${withBase('/en/')}"`,
      `href="${withBase('/members/')}"`,
      `href="${withBase('/projects/')}"`,
      `href="${withBase('/papers/')}"`,
      `href="${withBase('/news/')}"`,
      `href="${withBase('/life/')}"`,
      `href="${withBase('/join/')}"`,
    ],
  },
  {
    file: 'dist/en/index.html',
    includes: [
      '<html lang="en"',
      `<link rel="canonical" href="${siteUrl}en/">`,
      `<link rel="alternate" hreflang="zh-CN" href="${siteUrl}">`,
      `<meta property="og:url" content="${siteUrl}en/">`,
      `href="${withBase('/')}"`,
      `href="${withBase('/en/members/')}"`,
      `href="${withBase('/en/projects/')}"`,
      `href="${withBase('/en/papers/')}"`,
      `href="${withBase('/en/news/')}"`,
      `href="${withBase('/en/life/')}"`,
      `href="${withBase('/en/join/')}"`,
    ],
  },
  {
    file: 'dist/projects/project-1/index.html',
    includes: [
      `<link rel="canonical" href="${siteUrl}projects/project-1/">`,
      `<link rel="alternate" hreflang="en" href="${siteUrl}en/projects/project-1/">`,
      `href="${withBase('/en/projects/project-1/')}"`,
    ],
  },
  {
    file: 'dist/life/index.html',
    includes: [
      `<link rel="canonical" href="${siteUrl}life/">`,
      `<link rel="alternate" hreflang="en" href="${siteUrl}en/life/">`,
      `href="${withBase('/en/life/')}"`,
    ],
  },
  {
    file: 'dist/join/index.html',
    includes: [
      `<link rel="canonical" href="${siteUrl}join/">`,
      `<link rel="alternate" hreflang="en" href="${siteUrl}en/join/">`,
      `href="${withBase('/en/join/')}"`,
    ],
  },
  {
    file: 'dist/en/news/2026-10-10-group-site-launch/index.html',
    includes: [
      `<link rel="canonical" href="${siteUrl}en/news/2026-10-10-group-site-launch/">`,
      `<link rel="alternate" hreflang="zh-CN" href="${siteUrl}news/2026-10-10-group-site-launch/">`,
      '<meta property="og:type" content="article">',
      `href="${withBase('/news/2026-10-10-group-site-launch/')}"`,
    ],
  },
  {
    file: 'dist/404.html',
    includes: ['<meta name="robots" content="noindex, nofollow">'],
  },
];

try {
  checks.forEach(({ file, includes }) => {
    const html = readHtml(file);
    includes.forEach((needle) => assertIncludes(html, needle, file));
  });

  console.log('SEO / i18n checks passed');
} catch (error) {
  console.error(`SEO / i18n checks failed: ${error.message}`);
  process.exit(1);
}
