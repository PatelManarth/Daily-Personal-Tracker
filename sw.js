const CACHE = 'manarth-tracker-v7';
const ASSETS = [
  './','./index.html','./daily.html','./meals.html','./weekly.html','./measurements.html','./adjustments.html','./settings.html',
  './styles.css','./pages.css','./meals.css','./app.js','./navigation.js','./app-shell.js','./page-common.js','./frame-page.js','./today-page.js','./meals-shell.js','./meals-page.js',
  './db.js','./data.js','./data-core.js','./data-breakfast.js','./data-lunch.js','./data-snacks.js','./charts.js',
  './app-part-1.txt','./app-part-2.txt','./app-part-3.txt','./app-part-4.txt','./app-part-5.txt','./manifest.webmanifest','./icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        const cache = await caches.open(CACHE);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch (error) {
      if (event.request.mode === 'navigate') return caches.match('./index.html');
      throw error;
    }
  })());
});