// service-worker.js
const CACHE_NAME = 'neoarcana-app-v1';
const urlsToCache = [
  '/',
  '/nfc',
  '/static/css/modules/nfc.css',
  '/static/css/modules/step0.css',
  '/static/css/modules/trial-step2.css',
  '/static/css/galaxy_bg.css',
  '/static/css/Loader.css',
  '/static/css/CosmicButton.css',
  '/static/images/cards/card-back.jpg',
  '/static/icons/calendar.svg',
  '/static/icons/user.svg',
  '/static/icons/star.svg',
  '/static/icons/check.svg',
  '/static/icons/color.svg',
  '/static/icons/interests.svg',
  '/static/icons/future.svg',
  '/static/sound/cosmicnoise.mp3',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Cache files one by one and ignore failures
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(error => {
              console.warn(`Failed to cache ${url}:`, error);
            })
          )
        );
      })
  );
});

self.addEventListener('fetch', event => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// Add cache cleanup on activation
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              console.log(`Failed request: ${event.request.url} - Status: ${response?.status}`);
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(err => {
                console.error('Cache storage failed:', err);
              });

            return response;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            // Return a custom error response
            return new Response('Network request failed', {
              status: 500,
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});