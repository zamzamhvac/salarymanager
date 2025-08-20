// Cache ka ek unique naam aur version
const CACHE_NAME = 'salary-pro-cache-v2'; 

// Woh files jinke baghair app bilkul nahi chal sakti (App ka Jism)
const APP_SHELL_URLS = [
  '/index.html',
  '/manifest.json'
];

// Event 1: Jab Service Worker install ho
self.addEventListener('install', event => {
  console.log('Service Worker: Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(APP_SHELL_URLS);
      })
  );
});

// Event 2: Jab Service Worker activate ho
self.addEventListener('activate', event => {
  console.log('Service Worker: Activate');
  // Purane version ke tamam caches ko delete kar do
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Event 3: Jab app koi file maange (Fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    // Pehle cache mein dhoondo
    caches.match(event.request)
      .then(response => {
        // Agar cache mein mil jaye, to foran de do
        if (response) {
          return response;
        }

        // Agar cache mein na mile, to internet se lao
        return fetch(event.request);
      })
  );
});
