var cacheKey = new Date().toISOString();

var cacheWhiteList = [cacheKey]
var cacheFileList = [
  '/index.html',
  'main.js',
  'style.css',
  'star-wars-logo.jpg',
  'images/bountyHunters.jpg',
  'images/myLittleVader.jpg',
  'images/snowTroopers.jpg'
  
]
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('cacheKey').then(function(cache) {
      return cache.addAll(cacheFileList);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('images/myLittleVader.jpg');
      });
    }
  }));
});

self.addEventListener('activate',function(event){
  event.waitUntil(
    caches.keys().then(function(cacheName){
      return Promise.all(
        cacheName.map(function(cacheName){
          if(cacheWhiteList.lastIndexOf(cacheName) === -1){
            return caches.delete(cacheName) 
          }
        })
      )
    })
  )
})
