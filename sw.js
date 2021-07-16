const PREFIX = "V1";
const CACHED_FILES = [
    "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap",

]

self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(
        (async() => {
            const cache = await caches.open(PREFIX);
            await Promise.all([...CACHED_FILES, '/offline.html'].map((path) => {
                return cache.add(new Request(path));
            }))
        })()
    );
    console.log(`${PREFIX} Install`);
});

self.addEventListener("activate", (event) => {
    clients.claim();
    event.waitUntil(
        (async() => {
            const keys = await caches.keys();
            await Promise.all(
                keys.map((key) => {
                    if(!key.includes(PREFIX)) {
                        console.log(key);
                        return caches.delete(key)
                    }
                })
            );
        })()
    )
    console.log(`${PREFIX} Active`);
})


self.addEventListener('fetch', (event) => {
    console.log(
        `${PREFIX} Fetching : ${event.request.url}, Mode : ${event.request.mode}`
    )

    if(event.request.mode == "navigate") {
        event.respondWith(
            (async() => {
                try {
                    const preloadResponse = await event.reloadResponse;
                    if(preloadResponse) {
                        return preloadResponse;
                    }

                    return await fetch(event.request);
                } catch(e) {
                    const cache = await caches.open(PREFIX);
                    return await cache.match('/offline.html');
                }
            })()
        )
    } else if(CACHED_FILES.includes(event.request.url)) {
        event.respondWith(caches.match(event.request));
    }
});