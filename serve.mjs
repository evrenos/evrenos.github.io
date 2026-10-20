#!/usr/bin/env node
/**
 * Minimal local static server that mimics GitHub Pages closely enough for review:
 * correct MIME types, directory index.html, and 404.html for unknown paths.
 * Usage: node serve.mjs [port]   (or: npm run dev)
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.argv[2]) || 5500;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.ttf': 'font/ttf', '.otf': 'font/otf',
};

async function resolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const file = normalize(join(root, decoded));
  if (file !== root && !file.startsWith(root + sep)) return null; // path traversal guard
  try {
    const s = await stat(file);
    return s.isDirectory() ? join(file, 'index.html') : file;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  let file = await resolve(req.url);
  let status = 200;
  let body;
  try {
    body = await readFile(file);
  } catch {
    status = 404;
    file = join(root, '404.html');
    body = await readFile(file);
  }
  res.writeHead(status, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  res.end(body);
  console.log(status, req.url);
}).listen(port, '127.0.0.1', () => console.log(`Serving ${root}\n→ http://127.0.0.1:${port}/  (EN)\n→ http://127.0.0.1:${port}/tr/  (TR)`));
