const cacheName =
    "yamagishi-shopping-v2";

const filesToCache = [
    "./",
    "./index.html",
    "./manifest.json"
];

self.addEventListener(
    "install",
    function (event) {
        event.waitUntil(
            caches
                .open(cacheName)
                .then(
                    function (cache) {
                        return cache.addAll(
                            filesToCache
                        );
                    }
                )
        );

        self.skipWaiting();
    }
);

self.addEventListener(
    "activate",
    function (event) {
        event.waitUntil(
            caches
                .keys()
                .then(
                    function (
                        cacheNames
                    ) {
                        return Promise.all(
                            cacheNames.map(
                                function (
                                    currentCache
                                ) {
                                    if (
                                        currentCache !==
                                        cacheName
                                    ) {
                                        return caches.delete(
                                            currentCache
                                        );
                                    }
                                }
                            )
                        );
                    }
                )
        );

        self.clients.claim();
    }
);

self.addEventListener(
    "fetch",
    function (event) {
        if (
            event.request.method !==
            "GET"
        ) {
            return;
        }

        event.respondWith(
            fetch(event.request)
                .then(
                    function (response) {
                        const responseCopy =
                            response.clone();

                        caches
                            .open(cacheName)
                            .then(
                                function (
                                    cache
                                ) {
                                    cache.put(
                                        event.request,
                                        responseCopy
                                    );
                                }
                            );

                        return response;
                    }
                )
                .catch(
                    function () {
                        return caches.match(
                            event.request
                        );
                    }
                )
        );
    }
);
