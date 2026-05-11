/* ════════════════════════════════════════
   KST RM — Service Worker (PWA)
   Cache-first for static assets
   Network-first for Graph API calls
   ════════════════════════════════════════ */

const CACHE_NAME = 'kst-rm-v12';
const STATIC_ASSETS = [
  './kst_rm_purchase_ondrive.html',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap',
];

/* ── Install: pre-cache static assets ── */
self.addEventListener('install', e => {
  console.log('[KST SW] Installing...');
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS).catch(err => console.warn('[KST SW] Cache partial fail:', err)))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: clean old caches ── */
self.addEventListener('activate', e => {
  console.log('[KST SW] Activating...');
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch strategy ── */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Graph API & Auth → always network (no cache)
  if (url.hostname.includes('microsoftonline.com') ||
      url.hostname.includes('graph.microsoft.com') ||
      url.hostname.includes('login.microsoft')) {
    return; // Let browser handle normally
  }

  // Static assets → Cache-first, fallback network
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request)
        .then(res => {
          if (res && res.status === 200 && res.type !== 'opaque') {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => {
          // Offline fallback for HTML
          if (e.request.mode === 'navigate') {
            return caches.match('./kst_rm_purchase_ondrive.html');
          }
        });
    })
  );
});
