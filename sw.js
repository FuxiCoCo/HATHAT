// 更新快取版本並加入 announcements.json
// 更新快取版本以載入最新的 index.html 變更
const CACHE_NAME = 'hatfit-cache-v4';
// 使用 Service Worker 檔案所在位置計算基底，避免子路徑問題
const BASE = new URL('./', self.location).pathname;
const FILES_TO_CACHE = [
  'index.html',
  'manifest.json',
  'sw.js',
  'announcements.json'
].map(p => BASE + p);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) {
            return caches.delete(k);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
