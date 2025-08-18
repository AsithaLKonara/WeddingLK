// Service Worker for WeddingLK
const CACHE_NAME = 'weddinglk-v1';
const STATIC_CACHE = 'weddinglk-static-v1';
const DYNAMIC_CACHE = 'weddinglk-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  '/placeholder-logo.png',
  '/placeholder-user.jpg'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip non-HTTP requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Default: try network first, fallback to cache
  event.respondWith(handleDefaultRequest(request));
});

// Handle API requests
async function handleApiRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('API request failed, trying cache:', error);
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({ error: 'Offline - API not available' }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static assets
async function handleStaticAsset(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Try network
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Static asset request failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache the page
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
      return response;
    }
    
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/offline');
  } catch (error) {
    console.log('Navigation request failed, trying cache:', error);
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/offline');
  }
}

// Handle default requests
async function handleDefaultRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache the response
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Default request failed, trying cache:', error);
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response
    return new Response('Offline', { status: 503 });
  }
}

// Check if request is for a static asset
function isStaticAsset(pathname) {
  const staticExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
    '.woff', '.woff2', '.ttf', '.eot'
  ];
  
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  if (event.data) {
    try {
      const notification = event.data.json();
      
      const options = {
        body: notification.body || 'You have a new notification',
        icon: notification.icon || '/placeholder-logo.png',
        badge: notification.badge || '/placeholder-logo.png',
        tag: notification.tag || 'default',
        data: notification.data || {},
        actions: notification.actions || [],
        requireInteraction: notification.requireInteraction || false,
        silent: notification.silent || false,
        vibrate: [200, 100, 200],
        timestamp: Date.now()
      };
      
      event.waitUntil(
        self.registration.showNotification(notification.title || 'WeddingLK', options)
      );
    } catch (error) {
      console.error('Failed to parse push notification:', error);
      
      // Fallback notification
      const options = {
        body: 'You have a new notification from WeddingLK',
        icon: '/placeholder-logo.png',
        badge: '/placeholder-logo.png',
        tag: 'default'
      };
      
      event.waitUntil(
        self.registration.showNotification('WeddingLK', options)
      );
    }
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action) {
    // Handle custom actions
    handleNotificationAction(event.action, event.notification.data);
  } else {
    // Default click behavior
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          // Focus existing window if available
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new window if none exists
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

// Handle notification actions
function handleNotificationAction(action, data) {
  switch (action) {
    case 'view':
      if (data.url) {
        clients.openWindow(data.url);
      }
      break;
    case 'reply':
      // Handle reply action
      console.log('Reply action triggered');
      break;
    default:
      console.log('Unknown action:', action);
  }
}

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Perform background sync tasks
    console.log('Performing background sync...');
    
    // Example: sync offline data
    // await syncOfflineData();
    
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker loaded successfully'); 