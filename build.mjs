#!/usr/bin/env node
/**
 * Static build — no dependencies.
 * Renders src/ into the files GitHub Pages serves:
 *   index.html (EN) · tr/index.html (TR) · sitemap.xml
 * Usage: node build.mjs   (or: npm run build)
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage, renderSitemap } from './src/page.mjs';
import en from './src/content/en.mjs';
import tr from './src/content/tr.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const now = new Date();

const outputs = [
  ['index.html', renderPage(en, now)],
  ['tr/index.html', renderPage(tr, now)],
  ['sitemap.xml', renderSitemap(now)],
];

for (const [file, content] of outputs) {
  const target = join(root, file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, 'utf8');
  console.log(`✓ ${file.padEnd(16)} ${(Buffer.byteLength(content) / 1024).toFixed(1)} KB`);
}
