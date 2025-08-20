// Workbox (Google's Service Worker library) ko import karein
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// Agar Workbox load ho gaya hai to aage barhein
if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  const { precacheAndRoute } = workbox.precaching;
  const { registerRoute } = workbox.routing;
  const { StaleWhileRevalidate, CacheFirst, NetworkFirst } = workbox.strategies;
  const { CacheableResponsePlugin } = workbox.cacheable_response;

  // === PRE-CACHING (Sab se Zaroori Hissa) ===
  // In files ko foran download karke save kar lo, jaise hi Service Worker install ho.
  // Yeh aapka "App Shell" hai.
  precacheAndRoute([
    { url: '/', revision: null }, // Main page (index.html)
    { url: '/manifest.json', revision: null }, // Manifest file
    { url: '/offline.html', revision: null } // Safety-net offline page
  ]);

  // === RUNTIME CACHING STRATEGIES (Rules) ===

  // Rule 1: Static Resources (CSS, JS) ke liye
  // Pehle cache se do, background mein update karo (taake app taiz khule)
  registerRoute(
    ({ request }) => request.destination === 'style' || request.destination === 'script',
    new StaleWhileRevalidate({
      cacheName: 'static-resources-cache',
    })
  );

  // Rule 2: Images ke liye
  // Pehle cache se do. Agar cache mein nahi hai to network se lao.
  registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // Rule 3: Zaroori Configuration File ke liye (Aapka masla)
  // Pehle network se lane ki koshish karo (taake hamesha latest config ho).
  // Agar network na ho, to pichli dafa save ki hui config cache se de do.
  registerRoute(
    ({ url }) => url.pathname.includes('/.netlify/functions/get-config'),
    new NetworkFirst({
      cacheName: 'config-cache',
    })
  );

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
