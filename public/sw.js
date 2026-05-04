const CACHE_NAME = 'mentoria-beleza-v1'
const ASSETS = ['/', '/manifest.json', '/index.html']

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    }),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  const isApi =
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/backend/') ||
    url.host.includes('goskip.dev')

  if (event.request.method !== 'GET') return

  if (isApi) {
    // Network First for API
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone))
          return response
        })
        .catch(async () => {
          const cached = await caches.match(event.request)
          if (cached) return cached
          return new Response(JSON.stringify({ error: 'offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          })
        }),
    )
  } else if (event.request.headers.get('accept')?.includes('text/html')) {
    // Network First for HTML
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone))
          return response
        })
        .catch(async () => {
          const cached = await caches.match('/')
          if (cached) return cached
          return new Response('Offline', { status: 503 })
        }),
    )
  } else {
    // Cache First for other static assets
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse
        return fetch(event.request)
          .then((response) => {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone))
            return response
          })
          .catch(() => {
            return new Response('', { status: 404 })
          })
      }),
    )
  }
})
