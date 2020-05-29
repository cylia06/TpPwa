// Your Service Worker. You can use its instance with the keyword `self`
// Example: self.addEventListener(...)

const appShellCacheName = 'app-shell-v1';
const appShellFilesToCache = [
    '/assets/css/desktop.css',
    '/assets/css/fonts.css',
    '/assets/css/mobile.css',
    '/assets/css/normalize.css',
    '/assets/css/shell.css',
    '/assets/fonts/balsamiq-sans-v1-latin-700.woff',
    '/assets/fonts/balsamiq-sans-v1-latin-700.woff2',
    '/assets/fonts/balsamiq-sans-v1-latin-700italic.woff',
    '/assets/fonts/balsamiq-sans-v1-latin-700italic.woff2',
    '/assets/fonts/balsamiq-sans-v1-latin-italic.woff',
    '/assets/fonts/balsamiq-sans-v1-latin-italic.woff2',
    '/assets/fonts/balsamiq-sans-v1-latin-regular.woff',
    '/assets/fonts/balsamiq-sans-v1-latin-regular.woff2',
    '/assets/js/dexie.min.js',
    '/assets/js/fontawesome-pro-5.13.0.min.js',
    '/assets/js/lazysizes.min.js',
    '/assets/js/saved.js',
    '/assets/js/search.js',
    '/assets/js/trending.js',
    '/index.html',
    '/saved.html',
    '/search.html',
    '/sw.js'
    // TODO: 2a - Declare files and URLs to cache at Service Worker installation
];

const appCaches = [
    appShellCacheName,
];

// TODO: 2b - On install, add app shell files to cache
self.addEventListener('install', async (event)=>{ 
    console.log('Installation')
    event.waitUntil(
        caches.open(appShellCacheName)
        .then((cache) => {
            console.log(cache);
            return cache.addAll(appShellFilesToCache);
        })
    );
});
// TODO: 2c - On activation, remove obsolete caches
self.addEventListener('activate', async(event) => {
    var cacheWhitelist = [];
    console.log('Service worker activate event!');
    event.waitUntil(
        caches.keys()
        .then((cacheNames) => {
           
            return  Promise.all(
                cacheNames.map((cacheName)=>{
                    if(cacheWhitelist.indexOf(cacheName) === -1){
                        return caches.delete(cacheName)
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch',(event)=>{
    event.respondWith(
        caches.match(event.request)
        .then((response) =>{
            if (response){
                return response;
            }
            return fetch(event.request).then(
                (response) =>{
                    if(!response || response.status != 200 || response.type != 'basic'){
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(appShellCacheName)
                    .then((cache) =>{
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                }
            );
        })
    );
});
// TODO: 2d - On intercepted fetch, use the strategy of your choice to respond to requests
