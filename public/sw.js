let cacheData = 'appV1';

this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheData).then((cache) => {
            cache.addAll([
                "/static/js/bundle.js",
                "/manifest.json",
                "/sw.js",
                "/index.html",
                "/",
                "/dashboard",
                "/offers",
                "/companies_list",
                "/send_groupage",
                "/notification",
                "/register_company",
                "/about_us",
                "/login",
                "/reset_password/:token",
                "/company_details/:id",
            ])
        })
    )
})

this.addEventListener("fetch", (event) => {
    if (!navigator.onLine) {
        event.respondWith(
            caches.match(event.request).then((result) => {
                if (result) {
                    return result;
                }
                let requestUrl = event.request.clone();
                return fetch(requestUrl)
            })
        )
    }
})