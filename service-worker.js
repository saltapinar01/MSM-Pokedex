const CACHE_VERSION = "msm-pokedex-v9";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isData = url.pathname.includes("/data/") && url.pathname.endsWith(".json");
  const isShell = APP_SHELL.some((p) => url.pathname.endsWith(p.replace("./", "")) || url.pathname === "/" );

  if (isData || isShell) {
    // Network first, cache fallback: the app shell and database both update
    // immediately when online, and still work offline from the last-cached copy.
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache first for images/icons only — these don't change once added, so no
  // need to hit the network for them every time.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
        return res;
      });
    })
  );
});

// Background "download all" pass: the page posts every image URL in the dex
// once data has loaded, and this warms the cache for whichever ones aren't
// already there. Small worker pool instead of one big Promise.all so it
// doesn't try to open hundreds of connections on a mobile network at once;
// individual failures are swallowed so one bad URL can't stall the rest.
self.addEventListener("message", (event) => {
  const { type, urls } = event.data || {};
  if (type !== "CACHE_ALL" || !Array.isArray(urls) || !urls.length) return;
  event.waitUntil(cacheAllImages(urls, event.source));
});

async function cacheAllImages(urls, client) {
  const cache = await caches.open(CACHE_VERSION);
  const total = urls.length;
  let done = 0;
  let index = 0;
  const CONCURRENCY = 6;

  async function worker() {
    while (index < urls.length) {
      const url = urls[index++];
      try {
        if (!(await cache.match(url))) {
          const res = await fetch(url);
          if (res.ok) await cache.put(url, res);
        }
      } catch (err) {
        // Offline mid-sync, or a bad URL — skip it and keep going.
      }
      done++;
      if (client) client.postMessage({ type: "CACHE_PROGRESS", done, total });
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, total) }, worker));
  if (client) client.postMessage({ type: "CACHE_DONE", done, total });
}
