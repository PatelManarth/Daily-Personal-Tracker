import { readFileSync } from 'node:fs';

const pages = ['index.html','daily.html','meals.html','weekly.html','measurements.html','adjustments.html','settings.html'];
for (const page of pages) {
  const html = readFileSync(new URL(`../${page}`, import.meta.url), 'utf8');
  if (!html.includes('viewport')) throw new Error(`${page} is missing its mobile viewport.`);
}

const shell = readFileSync(new URL('../app-shell.js', import.meta.url), 'utf8');
for (const page of pages) {
  if (!shell.includes(page)) throw new Error(`Shared navigation is missing ${page}.`);
}

const serviceWorker = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
for (const page of pages) {
  if (!serviceWorker.includes(`./${page}`)) throw new Error(`Offline cache is missing ${page}.`);
}

console.log(`Validated ${pages.length} standalone pages, shared navigation and offline cache.`);