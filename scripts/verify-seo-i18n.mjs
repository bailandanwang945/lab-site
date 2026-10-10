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
const checks = [
  {
    file: 'dist/index.html',
    includes: [
      '<html lang="zh-CN"',
      `<link rel="canonical" href="${siteUrl}">`,
      `<link rel="alternate" hreflang="en" href="${siteUrl}en/">`,
      `<meta property="og:url" content="${siteUrl}">`,
      'href="/en/"',
      'href="/members/"',
      'href="/projects/"',
      'href="/papers/"',
      'href="/news/"',
      'href="/life/"',
      'href="/join/"',
    ],
  },
  {
    file: 'dist/en/index.html',
    includes: [
      '<html lang="en"',
      `<link rel="canonical" href="${siteUrl}en/">`,
      `<link rel="alternate" hreflang="zh-CN" href="${siteUrl}">`,
      `<meta property="og:url" content="${siteUrl}en/">`,
      'href="/"',
      'href="/en/members/"',
      'href="/en/projects/"',
      'href="/en/papers/"',
      'href="/en/news/"',
      'href="/en/life/"',
      'href="/en/join/"',
    ],
  },
  {
    file: 'dist/projects/project-1/index.html',
    includes: [
      `<link rel="canonical" href="${siteUrl}projects/project-1/">`,
      `<link rel="alternate" hreflang="en" href="${siteUrl}en/projects/project-1/">`,
      'href="/en/projects/project-1/"',
    ],
  },
  {
    file: 'dist/life/index.html',
    includes: [
      `<link rel="canonical" href="${siteUrl}life/">`,
      `<link rel="alternate" hreflang="en" href="${siteUrl}en/life/">`,
      'href="/en/life/"',
    ],
  },
  {
    file: 'dist/join/index.html',
    includes: [
      `<link rel="canonical" href="${siteUrl}join/">`,
      `<link rel="alternate" hreflang="en" href="${siteUrl}en/join/">`,
      'href="/en/join/"',
    ],
  },
  {
    file: 'dist/en/news/2026-10-10-group-site-launch/index.html',
    includes: [
      `<link rel="canonical" href="${siteUrl}en/news/2026-10-10-group-site-launch/">`,
      `<link rel="alternate" hreflang="zh-CN" href="${siteUrl}news/2026-10-10-group-site-launch/">`,
      '<meta property="og:type" content="article">',
      'href="/news/2026-10-10-group-site-launch/"',
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
