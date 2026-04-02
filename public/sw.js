const CACHE_VERSION = 'nyc-trip-v2'
const STATIC_CACHE = `static-${CACHE_VERSION}`
const WEATHER_CACHE = `weather-${CACHE_VERSION}`
const FONT_CACHE = `fonts-${CACHE_VERSION}`

// Weather cache TTL: 30 minutes
const WEATHER_CACHE_TTL = 30 * 60 * 1000

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
  '/icon-maskable-512.svg',
  '/apple-touch-icon.svg'
]

// Install: pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, WEATHER_CACHE, FONT_CACHE]
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch handler with different strategies per request type
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Weather API: network-first with cache fallback and TTL
  if (url.hostname === 'api.open-meteo.com') {
    event.respondWith(networkFirstWithCache(event.request, WEATHER_CACHE, WEATHER_CACHE_TTL))
    return
  }

  // Google Fonts: cache-first (they rarely change)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirstWithNetwork(event.request, FONT_CACHE))
    return
  }

  // App shell / static assets: cache-first with network fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstWithCache(event.request, STATIC_CACHE))
    return
  }

  // All other requests: stale-while-revalidate
  event.respondWith(staleWhileRevalidate(event.request, STATIC_CACHE))
})

// Network-first: try network, fall back to cache
async function networkFirstWithCache(request, cacheName, ttl) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      const responseToCache = networkResponse.clone()
      // Store with timestamp header for TTL checks
      if (ttl) {
        const headers = new Headers(responseToCache.headers)
        headers.set('sw-cache-time', Date.now().toString())
        const body = await responseToCache.blob()
        const timedResponse = new Response(body, {
          status: responseToCache.status,
          statusText: responseToCache.statusText,
          headers: headers
        })
        cache.put(request, timedResponse)
      } else {
        cache.put(request, responseToCache)
      }
    }
    return networkResponse
  } catch {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      // Check TTL if applicable
      if (ttl) {
        const cacheTime = cachedResponse.headers.get('sw-cache-time')
        if (cacheTime && (Date.now() - parseInt(cacheTime)) < ttl) {
          return cachedResponse
        }
        // Even if expired, still return stale data when offline
        return cachedResponse
      }
      return cachedResponse
    }
    // For navigation, return the cached index.html (SPA fallback)
    if (request.mode === 'navigate') {
      return caches.match('/index.html')
    }
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
  }
}

// Cache-first: try cache, fall back to network
async function cacheFirstWithNetwork(request, cacheName) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch {
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
  }
}

// Stale-while-revalidate: return cached version immediately, update in background
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request)
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        caches.open(cacheName).then((cache) => {
          cache.put(request, networkResponse.clone())
        })
      }
      return networkResponse
    })
    .catch(() => cachedResponse)

  return cachedResponse || fetchPromise
}
