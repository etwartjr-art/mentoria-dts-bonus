const CACHE_NAME = 'mentoria-beleza-static-v2'
const API_CACHE_NAME = 'mentoria-beleza-api-v2'
const ASSETS = ['/', '/manifest.json', '/index.html']
const API_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== API_CACHE_NAME)
          .map((key) => caches.delete(key)),
      )
    }),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  const isApi =
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/backend/') ||
    url.host.includes('goskip.dev') ||
    url.host.includes('pocketbase')

  if (event.request.method !== 'GET') return

  if (isApi) {
    // 5-minute cache for API
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request)
        if (cachedResponse) {
          const cachedTime = cachedResponse.headers.get('x-sw-cache-time')
          if (cachedTime && Date.now() - parseInt(cachedTime, 10) < API_CACHE_DURATION) {
            return cachedResponse
          }
        }

        return fetch(event.request)
          .then((response) => {
            // Only cache valid responses
            if (
              !response ||
              response.status !== 200 ||
              (response.type !== 'basic' && response.type !== 'cors')
            ) {
              return response
            }

            const clonedResponse = response.clone()
            const headers = new Headers(clonedResponse.headers)
            headers.append('x-sw-cache-time', Date.now().toString())

            clonedResponse.blob().then((body) => {
              cache.put(
                event.request,
                new Response(body, {
                  status: clonedResponse.status,
                  statusText: clonedResponse.statusText,
                  headers: headers,
                }),
              )
            })

            return response
          })
          .catch(async () => {
            if (cachedResponse) return cachedResponse
            return new Response(JSON.stringify({ error: 'offline' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            })
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
