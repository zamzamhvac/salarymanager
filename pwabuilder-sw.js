// Import Workbox libraries
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst, StaleWhileRevalidate, NetworkFirst } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheable_response;
const { ExpirationPlugin } = workbox.expiration;

// 1. App Shell ko Cache Karein (Buniyadi Dhancha)
// Yeh files app ko kholne ke liye zaroori hain
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

// 2. CSS, JS, aur doosri static files ko Cache Karein
// Is se app taizi se load hoti hai
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'static-resources-cache',
  })
);

// 3. Images ko Cache Karein
registerRoute(
    ({request}) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 20, // Sirf 20 images cache karein
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 din ke liye
            }),
            new CacheableResponsePlugin({
                statuses: [0, 200]
            })
        ]
    })
);

// 4. Zaroori Configuration File ko Cache Karein (Sab se Ahem Hissa)
// Yeh aapki /.netlify/functions/get-config wali request ko handle karega
registerRoute(
  ({ url }) => url.pathname.includes('/.netlify/functions/get-config'),
  new NetworkFirst({
    cacheName: 'config-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

// Yeh sunishchit karta hai ke naya service worker foran activate ho jaye
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
