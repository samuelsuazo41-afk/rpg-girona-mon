// sw.js - RPG Món de Girona - Versió HMN 12 entrades - Offline PWA
const CACHE_NAME = 'rpg-girona-mon-v5-hmn';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './main.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  // Dades base
  './data/capitols.json',
  './data/biblioteca_emojis.json',
  './data/botiga_emojis.json',
  './data/minijoc_frases.json',
  './data/categories_emoji.json',
  './data/items.json',
  // 4 Capitols
  './data/capitol_01_forca_vella.json',
  './data/capitol_02_temps_flors.json',
  './data/capitol_03_call_jueu.json',
  './data/capitol_04_sant_narcis.json',
  // 4 Llegendes HMN 150+ paraules - Història real
  './data/llegenda_01_forca_vella.json',
  './data/llegenda_02_temps_flors.json',
  './data/llegenda_03_call_jueu.json',
  './data/llegenda_04_sant_narcis.json',
  // 4 Rutes Secretes
  './data/ruta_secreta_01_tunel_forca_vella.json',
  './data/ruta_secreta_02_jardi_prohibit_catedral.json',
  './data/ruta_secreta_03_sinagoga_secreta.json',
  './data/ruta_secreta_04_vol_mosca.json'
];

self.addEventListener('install', event => {
  console.log('[SW] Install HMN v4');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cachejant 20 arxius');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activate HMN v4');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Esborrant cache vell:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
  );
});
