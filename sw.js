/* ════════════════════════════════════════
   KST RM — Service Worker v13
   Updated: cache bust for syntax fix
   ════════════════════════════════════════ */

const CACHE_NAME = 'kst-rm-v13';  // ← เพิ่มเลข version ทุกครั้งที่ update
const STATIC_ASSETS = [
  './kst_rm_purchase_ondrive.html',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => {
        console.log('[KST SW] Deleting old cache:', k);
        return caches.delete(k);
      })))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.hostname.includes('microsoftonline.com') ||
      url.hostname.includes('graph.microsoft.com')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      return fetch(e.request)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => cached || caches.match('./kst_rm_purchase_ondrive.html'));
    })
  );
});
