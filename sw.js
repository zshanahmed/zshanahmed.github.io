const cacheName = 'v2'

// Installing service worker
self.addEventListener('install', (e) => {
    console.log('Service Worker Installed!');
});

// Activating service worker
self.addEventListener('activate', (e) => {
    console.log('Service Worker Activated!');

    e.waitUntil(
        caches.keys().then(
            cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if (cache !== cacheName) {
                            console.log('Service Worker: Deleting Old Caches');
                            caches.delete(cache);
                        }
                    })
                )
            }
        )
    )
});

// Fetching assets from cache based on request
self.addEventListener('fetch', (e) => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request)
            .then(res => {
                const resClone = res.clone();
                caches
                    .open(cacheName)
                    .then(cache => {
                        cache.put(e.request, resClone)
                    })
                return res;
            }).catch(
                err => caches.match(e.request)
                    .then(res => res)
            )
    )
})