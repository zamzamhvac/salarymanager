// Version 3 - Final Code
const CACHE_NAME = 'digital-munshi-cache-v3';

const urlsToCache = [
    '/',
    '/index.html',
    // Yeh Nayi Line Humne Daali Hai
    '/.netlify/functions/get-config', 
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-app-compat.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-auth-compat.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-database-compat.min.js',
    'https://unpkg.com/dexie@3.2.2/dist/dexie.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Hamesha internet se laane ki koshish karo, agar na mile to cache se do
            return fetch(event.request).catch(() => response);
        })
    );
});
