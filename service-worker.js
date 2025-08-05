// service-worker.js ka poora code
const CACHE_NAME = 'digital-munshi-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-app-compat.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-auth-compat.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-database-compat.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
