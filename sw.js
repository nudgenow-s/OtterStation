const CACHE_NAME = 'precision-manager-v25'; // ← 每次发布新版本，改这个数字

const ASSETS = [
  './',
  './gate.html',
  './index.html',
  './main.html',
  './setup.html',
  './rate-fetcher.js',
  './accounting.js',
  './achievement.js',
  './cloud-sync.js',
  './config.js',
  './i18n-engine.js',
  './membership.html',
  './realcost.html',
  './realcost-beauty.html',
  './realcost-retail.html',
  './realcost-food.html',
  './realcost-history.html',
  './manifest.json'
];

// 安装：缓存所有资源，并立即激活新版本（不等旧页面关闭）
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()) // 新SW立即接管
  );
});

// 激活：清除所有旧版本缓存（localStorage不受影响）
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // 只删旧版缓存，不碰localStorage
          }
        })
      );
    }).then(() => self.clients.claim()) // 立即接管所有已打开的页面
  );
});

// 网络优先：优先从服务器拉最新代码，离线时才用缓存兜底
self.addEventListener('fetch', (e) => {
  // POST 及其他非 GET 请求直接放行，不走缓存
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        // 只缓存成功的 GET 响应
        if (networkResponse && networkResponse.status === 200) {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, cloned));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});

