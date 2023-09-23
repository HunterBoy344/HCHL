var current_cache = "pwa-assets";
let filesToCache = [
    `${self.location.href}`,
    `${self.location.href}manifest.json`,
    `${self.location.href}icon.png`,
    `${self.location.href}old.html`,
    `${self.location.href}cursortrail.png`,
    `${self.location.href}cursor.png`,
    `${self.location.href}bgm.mp3`,
    `${self.location.href}system.woff`,
    `${self.location.href}localforage.min.js`,
    `${self.location.href}empty_channel.png`,
    `${self.location.href}installer_channel.png`
];
caches.open("pwa-assets")
.then(cache => {
  cache.addAll(filesToCache)
});

self.addEventListener("install", (event) => {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();

  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();
});

addEventListener("message", (event) => {
  // event is an ExtendableMessageEvent object
  if (event.data instanceof File) {
    let response = new Response(event.data)
    caches.open(cache_name).then((cache) => {
      cache
        .put(event.data.name,response)
        .then(() => console.log("Data added to cache."))
        .catch((error) => console.error("Error adding data to cache:", error));
    });
  } else if (event.data instanceof Object) {
    if (event.data.type === "cachechange") {
      current_cache = event.data.cachename
      if (current_cache !== "pwa-assets") {
        alert(self.location.href)
        event.source.navigate(`${self.location.href}index.html/`)
      }
    }
  }
});

/*self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(current_cache).then(function(cache) {
      cache.match(event.request).then((response) => {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response !== undefined) {
          return response;
        } else {
          return fetch(event.request);
        }
      })
    })
  );
});*/

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(current_cache).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        if (response !== undefined) {
          return response;
        } else {
          return caches.match(event.request).then((response) => {
            // caches.match() always resolves
            // but in case of success response will have value
            if (response !== undefined) {
              return response;
            } else {
              return fetch(event.request);
            }
          })
        }
      });
    })
  );
});
