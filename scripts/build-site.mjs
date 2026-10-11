#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const astroCacheDir = path.resolve('.astro');
const astroEntry = path.resolve('node_modules/astro/astro.js');

fs.rmSync(distDir, { recursive: true, force: true });
fs.rmSync(astroCacheDir, { recursive: true, force: true });

if (process.env.ASTRO_TELEMETRY_DISABLED === undefined) {
  process.env.ASTRO_TELEMETRY_DISABLED = '1';
}

const result = spawnSync(process.execPath, [astroEntry, 'build'], {
  stdio: 'inherit',
  env: process.env,
  shell: false,
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

if (result.signal) {
  console.error(`Build interrupted by signal ${result.signal}`);
  process.exit(1);
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

// 构建后补base 前缀（Astro 的 base 不处理打包产物的静态资源引用）
const postbuild = spawnSync(process.execPath, [path.resolve('scripts/postbuild-base-prefix.mjs')], {
  stdio: 'inherit',
  env: process.env,
  shell: false,
});

if (postbuild.status !== 0) {
  console.error('[build] postbuild 步骤失败');
  process.exit(postbuild.status ?? 1);
}

process.exit(0);
