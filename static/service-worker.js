const CACHE_VERSION = 'v2.0.2';
const CACHE_NAME = `neoarcana-app-${CACHE_VERSION}`;

const urlsToCache = [
  '/',
  '/nfc',
  '/static/css/modules/nfc.css',
  '/static/css/modules/step0.css',
  '/static/css/modules/trial-step2.css',
  '/static/css/galaxy_bg.css',
  '/static/images/cards/card-back.jpg',
  '/static/images/bg_main.jpg',
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
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(error => {
              console.warn(`Failed to cache ${url}:`, error);
            })
          )
        );
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Clear old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      }),
      // Take control of all clients immediately
      clients.claim(),
      // Notify clients to reload
      clients.matchAll({ type: 'window' }).then(windowClients => {
        windowClients.forEach(windowClient => {
          windowClient.postMessage({ type: 'FORCE_RELOAD' });
        });
      })
    ])
  );
});

self.addEventListener('fetch', event => {
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
            if (!response || response.status !== 200 || response.type !== 'basic') {
              console.log(`Failed request: ${event.request.url} - Status: ${response?.status}`);
              return response;
            }

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

self.addEventListener('message', (event) => {
  if (event.data === 'checkVersion') {
    event.ports[0].postMessage({
      version: CACHE_VERSION
    });
  }
});