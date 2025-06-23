const CACHE_NAME = 'cardshow-pwa-v1.0.0';
const STATIC_CACHE_NAME = 'cardshow-static-v1';
const DYNAMIC_CACHE_NAME = 'cardshow-dynamic-v1';
const IMAGE_CACHE_NAME = 'cardshow-images-v1';
const API_CACHE_NAME = 'cardshow-api-v1';

// App shell resources for offline access
const STATIC_RESOURCES = [
  '/',
  '/cardshow',
  '/cardshow-manifest.json',
  '/crd-logo-gradient.png',
  // Add critical CSS and JS files
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== IMAGE_CACHE_NAME &&
                cacheName !== API_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    if (url.pathname.includes('/api/')) {
      // API requests - cache with TTL
      event.respondWith(handleApiRequest(request));
    } else if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
      // Images - cache with compression
      event.respondWith(handleImageRequest(request));
    } else if (url.pathname.startsWith('/cardshow')) {
      // App routes - serve from cache first
      event.respondWith(handleAppRequest(request));
    } else {
      // Other requests - network first
      event.respondWith(handleNetworkFirst(request));
    }
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'card-creation') {
    event.waitUntil(syncCardCreation());
  } else if (event.tag === 'trade-requests') {
    event.waitUntil(syncTradeRequests());
  } else if (event.tag === 'collection-updates') {
    event.waitUntil(syncCollectionUpdates());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/crd-logo-gradient.png',
    badge: '/crd-logo-gradient.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Cardshow', options)
  );
});

// API request handler with TTL caching
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Check if cached response is still valid (5 minutes TTL)
  if (cachedResponse) {
    const cachedDate = new Date(cachedResponse.headers.get('sw-cache-date'));
    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000;
    
    if (now - cachedDate < fiveMinutes) {
      return cachedResponse;
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      responseClone.headers.set('sw-cache-date', new Date().toISOString());
      cache.put(request, responseClone);
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Image request handler with compression
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Image not available offline', { status: 503 });
  }
}

// App request handler - cache first strategy
async function handleAppRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return cached index.html for SPA routes
    return cache.match('/');
  }
}

// Network first strategy
async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    return cache.match(request) || new Response('Offline', { status: 503 });
  }
}

// Background sync handlers
async function syncCardCreation() {
  try {
    const pendingCards = await getFromIndexedDB('pending-cards');
    for (const card of pendingCards) {
      await fetch('/api/cards', {
        method: 'POST',
        body: JSON.stringify(card),
        headers: { 'Content-Type': 'application/json' }
      });
      await removeFromIndexedDB('pending-cards', card.id);
    }
  } catch (error) {
    console.error('[SW] Card sync failed:', error);
  }
}

async function syncTradeRequests() {
  try {
    const pendingTrades = await getFromIndexedDB('pending-trades');
    for (const trade of pendingTrades) {
      await fetch('/api/trades', {
        method: 'POST',
        body: JSON.stringify(trade),
        headers: { 'Content-Type': 'application/json' }
      });
      await removeFromIndexedDB('pending-trades', trade.id);
    }
  } catch (error) {
    console.error('[SW] Trade sync failed:', error);
  }
}

async function syncCollectionUpdates() {
  try {
    const pendingUpdates = await getFromIndexedDB('pending-collections');
    for (const update of pendingUpdates) {
      await fetch(`/api/collections/${update.id}`, {
        method: 'PUT',
        body: JSON.stringify(update),
        headers: { 'Content-Type': 'application/json' }
      });
      await removeFromIndexedDB('pending-collections', update.id);
    }
  } catch (error) {
    console.error('[SW] Collection sync failed:', error);
  }
}

// IndexedDB helpers
function getFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CardshowDB', 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getRequest = store.getAll();
      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
    };
  });
}

function removeFromIndexedDB(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CardshowDB', 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(id);
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}
