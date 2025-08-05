// Naya aur Theek kiya hua code
// Version 2: Hum ne version badal diya hai taake browser naya code install kare
const CACHE_NAME = 'digital-munshi-cache-v2';

const urlsToCache = [
    '/',
    '/index.html',
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-app-compat.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-auth-compat.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.2/firebase-database-compat.min.js',
    'https://unpkg.com/dexie@3.2.2/dist/dexie.min.js'
];

// Event 1: Jab Service Worker install ho (Ismein koi tabdeeli nahi)
self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

// Event 2: Jab app koi file maange (IS HISSE KO HUMNE BEHTAR BANAYA HAI)
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // YEH NAYI HIDAYAT HAI:
    // Agar phone call Netlify ke function ke liye hai, to usay mat roko, seedha internet par jaane do.
    if (requestUrl.pathname.startsWith('/.netlify/functions/')) {
        event.respondWith(fetch(event.request));
        return; // Yahin par ruk jao
    }

    // Baaqi tamam calls ke liye, purana tareeka istemal karo (pehly cache mein dekho).
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
