const CACHE_NAME = 'rope-tension-cache-v1';

// 安裝時立刻接管
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 網路優先 (Network First) 策略
// 確保連線時永遠抓到最新版，斷線在深山時也能用快取開啟 APP！
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then((networkResponse) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      });
    }).catch(() => {
      return caches.match(event.request);
    })
  );
});