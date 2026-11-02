const CACHE_NAME = 'tra-search-cache-v3';
const urlsToCache = [
    './index.html',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+TC:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500;600&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const internalCachePromise = cache.addAll(urlsToCache).catch(err => {
        console.warn('Cache addAll warning:', err);
      });
      return internalCachePromise;
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith('https://tdx.transportdata.tw')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
