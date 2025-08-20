// sw.js (Final aur Behtareen Code)

const CACHE_NAME = 'digital-munshi-cache-v2'; // Humne version badal diya taake browser naya cache banaye
const urlsToCache = [
  '/',
  '/20 PWA .html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-app-compat.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-auth-compat.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-database-compat.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-app-check-compat.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js'
];

// Event 1: Install - Foran activate ho jao
self.addEventListener('install', event => {
  self.skipWaiting(); // Intezar mat karo
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache khul gaya');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event 2: Activate - Purana cache saaf karo aur foran control le lo
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Purane saare cache delete kar do
          }
        })
      );
    }).then(() => self.clients.claim()) // Foran saare open tabs ka control le lo
  );
});

// Event 3: Fetch - File ko cache se do ya internet se
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request); // Agar cache mein hai to wahan se do, warna internet se lao
      })
  );
});
