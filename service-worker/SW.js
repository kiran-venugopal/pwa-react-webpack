const webManifest = self.__WB_MANIFEST;
const resources = webManifest.map((manifest) => manifest.url);

self.addEventListener("install", (event) => {
  const addResourcesToCache = async (resources = []) => {
    const cache = await caches.open("v1");
    await cache.addAll(["/", ...resources]);
  };

  const addResourcePromise = addResourcesToCache(resources);
  event.waitUntil(addResourcePromise);
});

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  const responseFromNetwork = await fetch(request);
  putInCache(request, responseFromNetwork.clone());
  return responseFromNetwork;
};

self.addEventListener("fetch", (event) => {
  console.log(caches.match(event.request));
  event.respondWith(cacheFirst(event.request));
});

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener("activate", (event) => {
  event.waitUntil(enableNavigationPreload());
});
