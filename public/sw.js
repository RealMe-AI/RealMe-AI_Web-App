/* RealMe AI service worker */
const DEV = new URL(self.location.href).searchParams.get("dev") === "1";

const VERSION = "v1";
const STATIC_CACHE = `realme-static-${VERSION}`;
const PAGES_CACHE = `realme-pages-${VERSION}`;
const IMAGES_CACHE = `realme-images-${VERSION}`;
const OFFLINE_CACHE = `realme-offline-${VERSION}`;
const CURRENT_CACHES = [STATIC_CACHE, PAGES_CACHE, IMAGES_CACHE, OFFLINE_CACHE];

const LOCALES = ["en", "ha", "ig", "yo"];
const PUBLIC_PAGE_PREFIXES = ["/about", "/help", "/p"];

const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-192.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
  ...LOCALES.map((locale) => `/${locale}/offline`),
];

const PRIVATE_PREFIXES = [
  "/api",
  "/auth",
  "/account",
  "/setting",
  "/shared",
  "/d",
];

function isPrivatePath(pathname) {
  return PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isCacheablePage(pathname) {
  if (isPrivatePath(pathname)) return false;
  if (pathname === "/") return true;
  const locale = pathname.split("/")[1];
  if (!LOCALES.includes(locale)) return false;
  const localeless = pathname.replace(`/${locale}`, "") || "/";
  return (
    localeless === "/" ||
    PUBLIC_PAGE_PREFIXES.some(
      (prefix) =>
        localeless === prefix || localeless.startsWith(`${prefix}/`),
    )
  );
}

function getOfflineUrl(pathname) {
  const locale = pathname.split("/")[1];
  return `/${LOCALES.includes(locale) ? locale : "en"}/offline`;
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then(async (response) => {
      if (response.ok) await cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached || (await network) || new Response("", { status: 504 });
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    const pathname = new URL(request.url).pathname;

    if (response.ok && isCacheablePage(pathname)) {
      const cache = await caches.open(PAGES_CACHE);
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    const offline = await caches.match(
      getOfflineUrl(new URL(request.url).pathname),
    );
    if (offline) return offline;

    return new Response("You are offline.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

self.addEventListener("install", (event) => {
  if (DEV) {
    self.skipWaiting();
    return;
  }

  event.waitUntil(
    (async () => {
      const cache = await caches.open(OFFLINE_CACHE);

      await Promise.allSettled(
        PRECACHE_URLS.map(async (url) => {
          const request = new Request(url, { cache: "reload" });
          const response = await fetch(request);
          if (response.ok) await cache.put(request, response);
        }),
      );
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      if (DEV) {
        await Promise.all(
          keys.filter((key) => key.startsWith("realme-")).map((key) => caches.delete(key)),
        );
      } else {
        await Promise.all(
          keys
            .filter(
              (key) => key.startsWith("realme-") && !CURRENT_CACHES.includes(key),
            )
            .map((key) => caches.delete(key)),
        );
      }

      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  if (DEV) return;

  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (isPrivatePath(url.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (request.headers.get("RSC") || request.headers.get("Next-Router-Prefetch")) {
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (
    request.destination === "image" ||
    request.destination === "font" ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(staleWhileRevalidate(request, IMAGES_CACHE));
    return;
  }

  if (url.pathname === "/manifest.webmanifest") {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
  }
});
