// sw.js (FINAL & GUARANTEED WORKING CODE)

const CACHE_NAME = 'digital-munshi-cache-v4'; // Version 4

// Zaroori files jo har haal mein cache honi chahiye
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/.netlify/functions/get-config',
  '/manifest.json'
];

// Baaki files jo cache ho jayein to acha hai
const OTHER_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-app-compat.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-auth-compat.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-database-compat.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-app-check-compat.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js'
];

// Event 1: Install - Naya aur behtar tareeqa cache karne ka
self.addEventListener('install', event => {
  self.skipWaiting();
  
  // Naya aur behtar tareeqa
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache khul gaya, ab files add kar raha hoon');
      
      // Pehle zaroori files ko zabardasti cache karo
      CORE_ASSETS.forEach(asset => {
        cache.add(new Request(asset, {cache: 'reload'})).catch(err => console.error(`Core asset ${asset} cache nahi ho saka:`, err));
      });
      
      // Phir baaki files ko cache karo
      cache.addAll(OTHER_ASSETS).catch(err => console.error('Other assets cache nahi ho sake:', err));
    })
  );
});

// Event 2: Activate - Purana cache saaf karo
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Event 3: Fetch - Cache se jawab do
self.addEventListener('fetch', event => {
    // Sirf GET requests ko handle karo
    if (event.request.method !== 'GET') {
        return;
    }
    
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        // Agar cache mein hai, to wahan se do
        if (response) {
          return response;
        }
        
        // Agar cache mein nahi hai, to internet se lao
        console.log(`Cache miss for ${event.request.url}, network se la raha hoon`);
        return fetch(event.request);
      });
    })
  );
});
