/*
 * Kiosk service worker — keeps the app shell available when the in-store network
 * blips, so an unattended terminal can reload from cache instead of showing a
 * white screen. Third-party Travelpayouts hosts are never cached (always live).
 *
 * Bump CACHE_VERSION when the caching strategy changes to purge old caches.
 */
const CACHE_VERSION = "kiosk-v1";
const APP_SHELL = ["/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GETs. Cross-origin (Travelpayouts widget, Drive,
  // Aviasales…) falls through to the network and is never cached.
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Navigations: network-first (fresh HTML when online) with cache fallback so
  // the shell still loads offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put("/", copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Hashed static assets: cache-first (immutable), backfilling the cache.
  const isStatic =
    url.pathname.startsWith("/_next/static") ||
    url.pathname === "/icon.svg" ||
    url.pathname === "/manifest.webmanifest";

  if (isStatic) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
            return res;
          })
      )
    );
    return;
  }

  // Everything else same-origin: network-first, cache fallback.
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});
