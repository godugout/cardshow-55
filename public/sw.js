
const CACHE_NAME = 'cardshow-pwa-v2.0.0';
const STATIC_CACHE_NAME = 'cardshow-static-v2';
const DYNAMIC_CACHE_NAME = 'cardshow-dynamic-v2';
const IMAGE_CACHE_NAME = 'cardshow-images-v2';
const API_CACHE_NAME = 'cardshow-api-v2';

// Critical app shell resources
const STATIC_RESOURCES = [
  '/',
  '/cardshow',
  '/cardshow-manifest.json',
  '/crd-logo-gradient.png',
  '/offline.html'
];

// Cache size limits (in bytes)
const CACHE_LIMITS = {
  [IMAGE_CACHE_NAME]: 50 * 1024 * 1024, // 50MB for images
  [DYNAMIC_CACHE_NAME]: 20 * 1024 * 1024, // 20MB for dynamic content
  [API_CACHE_NAME]: 10 * 1024 * 1024 // 10MB for API responses
};

// Install event - aggressive caching of critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v2.0.0');
  event.waitUntil(
    Promise.all([
      // Cache critical resources
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(STATIC_RESOURCES);
      }),
      // Pre-warm other caches
      caches.open(IMAGE_CACHE_NAME),
      caches.open(DYNAMIC_CACHE_NAME),
      caches.open(API_CACHE_NAME)
    ]).then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v2.0.0');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheName.includes('v2')) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Initialize cache management
      initializeCacheManagement()
    ]).then(() => {
      console.log('[SW] Activation complete');
      return self.clients.claim();
    })
  );
});

// Enhanced fetch handler with intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle different types of requests with specific strategies
  if (url.pathname.includes('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else if (isImageRequest(url.pathname)) {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticResource(url.pathname)) {
    event.respondWith(handleStaticResource(request));
  } else if (url.origin === location.origin) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleExternalRequest(request));
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case 'card-creation':
      event.waitUntil(syncCardCreation());
      break;
    case 'trade-requests':
      event.waitUntil(syncTradeRequests());
      break;
    case 'collection-updates':
      event.waitUntil(syncCollectionUpdates());
      break;
    case 'analytics-events':
      event.waitUntil(syncAnalyticsEvents());
      break;
    default:
      event.waitUntil(syncGeneral(event.tag));
  }
});

// Enhanced push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let notificationData = {
    title: 'Cardshow',
    body: 'You have a new notification',
    icon: '/crd-logo-gradient.png',
    badge: '/crd-logo-gradient.png'
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    image: notificationData.image,
    vibrate: [200, 100, 200],
    data: {
      url: notificationData.url || '/',
      timestamp: Date.now(),
      type: notificationData.type || 'general'
    },
    actions: getNotificationActions(notificationData.type),
    requireInteraction: notificationData.requireInteraction || false,
    tag: notificationData.tag || 'general'
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data.url || '/';
  
  if (event.action) {
    handleNotificationAction(event.action, event.notification.data);
  } else {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Try to focus existing window
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if none found
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Helper Functions

function isImageRequest(pathname) {
  return /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(pathname);
}

function isStaticResource(pathname) {
  return /\.(js|css|woff2?|ttf|eot)$/i.test(pathname) || 
         pathname.includes('/static/') ||
         pathname === '/cardshow-manifest.json';
}

async function handleStaticResource(request) {
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
    console.error('[SW] Static resource fetch failed:', error);
    return new Response('Resource unavailable offline', { status: 503 });
  }
}

async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    updateImageCacheInBackground(request, cache);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Clone and cache the response
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      
      // Manage cache size
      await manageCacheSize(IMAGE_CACHE_NAME);
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Image fetch failed:', error);
    // Return placeholder image for failed requests
    return cache.match('/crd-logo-gradient.png') || 
           new Response('Image unavailable offline', { status: 503 });
  }
}

async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  const url = new URL(request.url);
  
  // Create cache key without dynamic parameters
  const cacheKey = createApiCacheKey(request);
  const cachedResponse = await cache.match(cacheKey);
  
  // Check cache freshness (5 minutes for most API calls)
  const cacheTimeout = getCacheTimeout(url.pathname);
  if (cachedResponse && isCacheFresh(cachedResponse, cacheTimeout)) {
    // Update cache in background for critical endpoints
    if (isCriticalEndpoint(url.pathname)) {
      updateApiCacheInBackground(request, cache, cacheKey);
    }
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      // Add cache timestamp
      const responseWithTimestamp = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: {
          ...Object.fromEntries(responseClone.headers.entries()),
          'sw-cache-time': Date.now().toString()
        }
      });
      
      cache.put(cacheKey, responseWithTimestamp);
      await manageCacheSize(API_CACHE_NAME);
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] API request failed:', error);
    return cachedResponse || new Response(
      JSON.stringify({ error: 'API unavailable offline' }), 
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleNavigationRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Serve cached page or offline fallback
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Serve offline page for navigation requests
    const offlinePage = await cache.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
    
    // Fallback to index.html for SPA routes
    return cache.match('/') || new Response('Offline', { status: 503 });
  }
}

async function handleExternalRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('[SW] External request failed:', error);
    return new Response('External resource unavailable', { status: 503 });
  }
}

// Cache Management Functions

async function initializeCacheManagement() {
  // Schedule periodic cache cleanup
  setInterval(async () => {
    await cleanupExpiredCaches();
    await manageCacheSizes();
  }, 30 * 60 * 1000); // Every 30 minutes
}

async function manageCacheSize(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const limit = CACHE_LIMITS[cacheName];
  
  if (!limit) return;
  
  let totalSize = 0;
  const entries = [];
  
  for (const key of keys) {
    const response = await cache.match(key);
    if (response) {
      const size = await getResponseSize(response);
      totalSize += size;
      entries.push({ key, size, lastAccessed: getLastAccessTime(response) });
    }
  }
  
  if (totalSize > limit) {
    // Sort by last accessed time (LRU)
    entries.sort((a, b) => a.lastAccessed - b.lastAccessed);
    
    // Remove oldest entries until under limit
    let currentSize = totalSize;
    for (const entry of entries) {
      if (currentSize <= limit * 0.8) break; // Leave 20% buffer
      
      await cache.delete(entry.key);
      currentSize -= entry.size;
    }
    
    console.log(`[SW] Cache ${cacheName} cleaned up: ${totalSize} -> ${currentSize} bytes`);
  }
}

async function getResponseSize(response) {
  const clone = response.clone();
  const arrayBuffer = await clone.arrayBuffer();
  return arrayBuffer.byteLength;
}

function getLastAccessTime(response) {
  const timestamp = response.headers.get('sw-last-access');
  return timestamp ? parseInt(timestamp) : Date.now();
}

function createApiCacheKey(request) {
  const url = new URL(request.url);
  // Remove timestamp and other dynamic parameters
  url.searchParams.delete('_t');
  url.searchParams.delete('timestamp');
  return url.toString();
}

function getCacheTimeout(pathname) {
  // Different timeouts for different API endpoints
  if (pathname.includes('/cards/')) return 10 * 60 * 1000; // 10 minutes
  if (pathname.includes('/collections/')) return 5 * 60 * 1000; // 5 minutes
  if (pathname.includes('/auth/')) return 1 * 60 * 1000; // 1 minute
  return 5 * 60 * 1000; // Default 5 minutes
}

function isCacheFresh(response, timeout) {
  const cacheTime = response.headers.get('sw-cache-time');
  if (!cacheTime) return false;
  
  return Date.now() - parseInt(cacheTime) < timeout;
}

function isCriticalEndpoint(pathname) {
  return pathname.includes('/auth/') || pathname.includes('/user/');
}

async function updateImageCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Silent failure for background updates
  }
}

async function updateApiCacheInBackground(request, cache, cacheKey) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseWithTimestamp = new Response(networkResponse.body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: {
          ...Object.fromEntries(networkResponse.headers.entries()),
          'sw-cache-time': Date.now().toString()
        }
      });
      cache.put(cacheKey, responseWithTimestamp);
    }
  } catch (error) {
    // Silent failure for background updates
  }
}

function getNotificationActions(type) {
  switch (type) {
    case 'trade':
      return [
        { action: 'view', title: 'View Trade', icon: '/icons/view.png' },
        { action: 'respond', title: 'Respond', icon: '/icons/reply.png' }
      ];
    case 'auction':
      return [
        { action: 'bid', title: 'Place Bid', icon: '/icons/bid.png' },
        { action: 'watch', title: 'Watch', icon: '/icons/watch.png' }
      ];
    default:
      return [
        { action: 'view', title: 'View', icon: '/icons/view.png' }
      ];
  }
}

async function handleNotificationAction(action, data) {
  const clients = await self.clients.matchAll({ type: 'window' });
  
  switch (action) {
    case 'view':
      return openOrFocusWindow(data.url || '/', clients);
    case 'respond':
      return openOrFocusWindow(`${data.url}?action=respond`, clients);
    case 'bid':
      return openOrFocusWindow(`${data.url}?action=bid`, clients);
    default:
      return openOrFocusWindow('/', clients);
  }
}

async function openOrFocusWindow(url, existingClients) {
  for (const client of existingClients) {
    if (client.url.includes(url.split('?')[0]) && 'focus' in client) {
      return client.focus();
    }
  }
  
  if (self.clients.openWindow) {
    return self.clients.openWindow(url);
  }
}

// Background Sync Functions

async function syncCardCreation() {
  try {
    const pendingCards = await getFromIndexedDB('pending-cards');
    let syncedCount = 0;
    
    for (const card of pendingCards) {
      try {
        const response = await fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(card)
        });
        
        if (response.ok) {
          await removeFromIndexedDB('pending-cards', card.id);
          syncedCount++;
        }
      } catch (error) {
        console.error('[SW] Failed to sync card:', card.id, error);
      }
    }
    
    if (syncedCount > 0) {
      await showSyncNotification('Card Creation', `${syncedCount} cards synced successfully`);
    }
  } catch (error) {
    console.error('[SW] Card sync failed:', error);
  }
}

async function syncTradeRequests() {
  try {
    const pendingTrades = await getFromIndexedDB('pending-trades');
    let syncedCount = 0;
    
    for (const trade of pendingTrades) {
      try {
        const response = await fetch('/api/trades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trade)
        });
        
        if (response.ok) {
          await removeFromIndexedDB('pending-trades', trade.id);
          syncedCount++;
        }
      } catch (error) {
        console.error('[SW] Failed to sync trade:', trade.id, error);
      }
    }
    
    if (syncedCount > 0) {
      await showSyncNotification('Trade Requests', `${syncedCount} trades synced successfully`);
    }
  } catch (error) {
    console.error('[SW] Trade sync failed:', error);
  }
}

async function syncCollectionUpdates() {
  // Similar implementation for collection updates
  console.log('[SW] Syncing collection updates...');
}

async function syncAnalyticsEvents() {
  // Sync analytics events
  console.log('[SW] Syncing analytics events...');
}

async function syncGeneral(tag) {
  console.log(`[SW] Syncing general data for tag: ${tag}`);
}

async function showSyncNotification(title, body) {
  const options = {
    body,
    icon: '/crd-logo-gradient.png',
    badge: '/crd-logo-gradient.png',
    tag: 'sync-notification',
    requireInteraction: false,
    silent: true
  };
  
  await self.registration.showNotification(title, options);
}

// IndexedDB helpers
async function getFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CardshowDB', 1);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
    
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        resolve([]);
        return;
      }
      
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getRequest = store.getAll();
      
      getRequest.onsuccess = () => resolve(getRequest.result || []);
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

async function removeFromIndexedDB(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CardshowDB', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        resolve();
        return;
      }
      
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Performance monitoring
setInterval(() => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    navigator.storage.estimate().then(estimate => {
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentage = (usage / quota) * 100;
      
      if (percentage > 80) {
        console.warn(`[SW] Storage usage high: ${percentage.toFixed(1)}%`);
        // Trigger aggressive cleanup
        manageCacheSizes();
      }
    });
  }
}, 5 * 60 * 1000); // Check every 5 minutes
