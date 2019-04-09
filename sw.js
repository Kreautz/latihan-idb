var CACHE_NAME = 'alpwa-cache-v1';
var urlsToCache = [
  '/',
  '/css/main.css',
  '/js/main.js',
  '/images/logo.png',
  '/js/jquery.min.js',
  '/fallback.json'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('service worker do install..',cache);
        return cache.addAll(urlsToCache);
      })
  );
});
//aktivasi cache
self.addEventListener('activate', function(event) {  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName){
            return cacheName !== CACHE_NAME
        }).map(function(cacheName){
            return caches.delete(cacheName)
        })
      );
    })
  );
});
/*fetch cache*/
self.addEventListener('fetch', function(event) {
  var request=event.request;
  var url =new URL(request.url);
  //memsisahkan file dengan cache url;
if (url.origin=== location.origin){
  event.respondWith(
    caches.match(request).then (function(response){
      return response || fetch(request);
    })
  )
}
else {
  event.respondWith(
    caches.open('alpwa-cache-v1')
    .then(function(cache){
      return fetch(request).then(function (liveRequest){
        return liveRequest;
      }).catch(function(){
        return caches.match(request)
        .then(function(response){
          if(response)return response;
          return caches.match('/fallback.json');
        })

        
      })
    })
  )
}

});
self.addEventListener('sync', function(event){
  console.log('firing sync');
  if(event === 'image-fetch'){
    console.log('sync event fired');
    event.waitUntil(fetchImage());
  }
})
function fetchImage(){
  console.log('firing : doSomeStuff()');
  fetch('/images/logo.png').then(function(response){
    return response;
  }).then(function(text){
    console.log('Request success ', text);
  }).catch(function(err){
    console.log('Request failed', err);
  });
}
  //   event.respondWith(
  //     caches.match(event.request)
  //       .then(function(response) {
  //        console.log(response);
  //         // Cache hit - return response
  //         if (response) {
  //           return response;
  //         }
  //         return fetch(event.request);
  //       }
  //     )
  //   );
  // });
