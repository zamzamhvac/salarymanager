// sw.js (Service Worker) File

const CACHE_NAME = 'digital-munshi-cache-v1';
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

// Event 1: Install - Jab Service Worker pehli baar install hota hai
self.addEventListener('install', event => {
  self.skipWaiting();
  // Ruko jab tak cache mein saari files save na ho jayein
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache khul gaya');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event 2: Fetch - Jab bhi app koi file ya data mangti hai
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Agar file cache mein mil jati hai, to wahan se de do
        if (response) {
          return response;
        }
        // Agar nahi milti, to internet se fetch karo
        return fetch(event.request);
      }
    )
  );
});
