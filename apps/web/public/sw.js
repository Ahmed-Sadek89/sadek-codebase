/*
 * Service worker for the portfolio website (registered by
 * libs/pwa/register-service-worker.tsx in production only).
 *
 * - Pages: network first; a copy of each successful page is kept so visited
 *   pages open offline; with no copy, /offline.html.
 * - /_next/static/ (content-hashed build files): cache first.
 * - Images, icons, fonts and /_next/image: stale-while-revalidate, capped.
 * - Everything else (the backend API on another origin, RSC data requests,
 *   non-GET requests such as the contact form) goes straight to the network.
 *
 * Bump VERSION to drop every old cache on the next visit.
 */
const VERSION = "v1";
const PRECACHE = `precache-${VERSION}`;
const PAGES = `pages-${VERSION}`;
const STATIC = `static-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const CURRENT_CACHES = [PRECACHE, PAGES, STATIC, ASSETS];

const OFFLINE_URL = "/offline.html";
const PRECACHE_URLS = [
  OFFLINE_URL,
  "/favicon.ico",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

/** Most entries kept per runtime cache; the oldest go first. */
const MAX_PAGES = 20;
const MAX_ASSETS = 80;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => !CURRENT_CACHES.includes(name))
          .map((name) => caches.delete(name)),
      );
      // Faster first navigations while the worker starts up.
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Other origins (the backend API, analytics, CDN images loaded directly).
  if (url.origin !== self.location.origin) return;
  // Next.js RSC / prefetch data: always fresh from the server.
  if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return;
  // Never cache the worker itself.
  if (url.pathname === "/sw.js") return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(event));
    return;
  }
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC));
    return;
  }
  if (
    url.pathname.startsWith("/_next/image") ||
    ["image", "font"].includes(request.destination) ||
    /\.(?:png|jpe?g|webp|avif|gif|svg|ico|woff2?)$/i.test(url.pathname)
  ) {
    event.respondWith(staleWhileRevalidate(event, ASSETS, MAX_ASSETS));
  }
});

async function networkFirstPage(event) {
  const { request } = event;
  try {
    const response = (await event.preloadResponse) || (await fetch(request));
    if (response.ok && response.type === "basic") {
      const copy = response.clone();
      event.waitUntil(put(PAGES, request, copy, MAX_PAGES));
    }
    return response;
  } catch {
    const cached = await caches.match(request, { ignoreSearch: true });
    return cached || (await caches.match(OFFLINE_URL));
  }
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(event, cacheName, maxEntries) {
  const { request } = event;
  const cached = await caches.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) {
        event.waitUntil(put(cacheName, request, response.clone(), maxEntries));
      }
      return response;
    })
    .catch(() => undefined);
  if (cached) {
    event.waitUntil(network);
    return cached;
  }
  return (await network) || Response.error();
}

/** Stores a response, then trims the cache to its newest `maxEntries`. */
async function put(cacheName, request, response, maxEntries) {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
  const keys = await cache.keys();
  await Promise.all(
    keys.slice(0, Math.max(0, keys.length - maxEntries)).map((key) => cache.delete(key)),
  );
}
