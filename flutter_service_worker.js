'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "012d6ad73f8ec782e35acc422928e145",
"assets/AssetManifest.bin.json": "49e5e706e857cead5fc70faf0d81bd41",
"assets/AssetManifest.json": "d6e012c7c6a610f9e34618458ef84873",
"assets/assets/logo.png": "3bf4d98f7e7b7195dfb5aca44d7ceba4",
"assets/FontManifest.json": "36566366cde1a92faa9873206915521b",
"assets/fonts/MaterialIcons-Regular.otf": "2e28c51a14e262b9aff4188507eda0a3",
"assets/NOTICES": "8bfaf557b1eab09dc68847ae2aad414e",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/packages/lucide_icons_flutter/assets/build_font/LucideVariable-w100.ttf": "58875d41f6bf07790532f5d9be6612a6",
"assets/packages/lucide_icons_flutter/assets/build_font/LucideVariable-w200.ttf": "6c63d0c1ccd5ae46d2311b6585494b95",
"assets/packages/lucide_icons_flutter/assets/build_font/LucideVariable-w300.ttf": "d63e715be33c8141f93b9f903ec1d115",
"assets/packages/lucide_icons_flutter/assets/build_font/LucideVariable-w400.ttf": "bf9520425b5a3c38255797ba578b3638",
"assets/packages/lucide_icons_flutter/assets/build_font/LucideVariable-w500.ttf": "a7939ddb6ad4fa70e221fd2fec09eb6a",
"assets/packages/lucide_icons_flutter/assets/build_font/LucideVariable-w600.ttf": "ee7b0f7221dcb59b5a356e73e7285d83",
"assets/packages/lucide_icons_flutter/assets/lucide.ttf": "049d1cf3fee4f855274fc55184c44f73",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "86e461cf471c1640fd2b461ece4589df",
"canvaskit/canvaskit.js.symbols": "68eb703b9a609baef8ee0e413b442f33",
"canvaskit/canvaskit.wasm": "efeeba7dcc952dae57870d4df3111fad",
"canvaskit/chromium/canvaskit.js": "34beda9f39eb7d992d46125ca868dc61",
"canvaskit/chromium/canvaskit.js.symbols": "5a23598a2a8efd18ec3b60de5d28af8f",
"canvaskit/chromium/canvaskit.wasm": "64a386c87532ae52ae041d18a32a3635",
"canvaskit/skwasm.js": "f2ad9363618c5f62e813740099a80e63",
"canvaskit/skwasm.js.symbols": "80806576fa1056b43dd6d0b445b4b6f7",
"canvaskit/skwasm.wasm": "f0dfd99007f989368db17c9abeed5a49",
"canvaskit/skwasm_st.js": "d1326ceef381ad382ab492ba5d96f04d",
"canvaskit/skwasm_st.js.symbols": "c7e7aac7cd8b612defd62b43e3050bdd",
"canvaskit/skwasm_st.wasm": "56c3973560dfcbf28ce47cebe40f3206",
"favicon.png": "d09dc179ff58cb03c789ed07522116ae",
"flutter.js": "76f08d47ff9f5715220992f993002504",
"flutter_bootstrap.js": "6e05a7bdd5f8642178837c6e8f74fe98",
"icons/Icon-192.png": "8022504330ce035ce9f40ac9df4c2c44",
"icons/Icon-512.png": "0fcf9c2682aada527ac1ad408fdfa963",
"icons/Icon-maskable-192.png": "8022504330ce035ce9f40ac9df4c2c44",
"icons/Icon-maskable-512.png": "0fcf9c2682aada527ac1ad408fdfa963",
"index.html": "7c0567f918363e588aba7e0d30f0c524",
"/": "7c0567f918363e588aba7e0d30f0c524",
"main.dart.js": "af14d91e964cc380da1f7dc3ee0658ed",
"manifest.json": "f642eb4bc5db4ab3b37676db98cdc050",
"splash/img/dark-1x.png": "cb4d058fdd0bc8d20fae7313b853589f",
"splash/img/dark-2x.png": "e1eba7962125dac9e4752c43d10a7ddc",
"splash/img/dark-3x.png": "a4a4eaebb0b4623611673105adb904ed",
"splash/img/dark-4x.png": "3ad0076016ad730339bc4ee51b967214",
"splash/img/light-1x.png": "cb4d058fdd0bc8d20fae7313b853589f",
"splash/img/light-2x.png": "e1eba7962125dac9e4752c43d10a7ddc",
"splash/img/light-3x.png": "a4a4eaebb0b4623611673105adb904ed",
"splash/img/light-4x.png": "3ad0076016ad730339bc4ee51b967214",
"version.json": "1e8f24eb2ff9f9fbd8aecf7368cb6c60"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
