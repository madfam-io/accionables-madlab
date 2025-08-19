// MADLAB Service Worker
const CACHE_NAME = 'madlab-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/variables.css',
  '/css/themes.css',
  '/css/base.css',
  '/css/components.css',
  '/js/app.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});