// let cacheData = 'appV1';

// this.addEventListener("install", (event) => {
//     event.waitUntil(
//         caches.open(cacheData).then((cache) => {
//             cache.addAll([
//                 "/static/js/bundle.js",
//                 "/manifest.json",
//                 "/sw.js",
//                 "/index.html",
//                 "/",
//                 "/dashboard",
//                 "/offers",
//                 "/companies_list",
//                 "/send_groupage",
//                 "/notification",
//                 "/register_company",
//                 "/about_us",
//                 "/login",
//                 "/reset_password/:token",
//                 "/company_details/:id",
//             ])
//         })
//     )
// })

// this.addEventListener("fetch", (event) => {
//     if (!navigator.onLine) {
//         event.respondWith(
//             caches.match(event.request).then((result) => {
//                 if (result) {
//                     return result;
//                 }
//                 let requestUrl = event.request.clone();
//                 return fetch(requestUrl)
//             })
//         )
//     }
// })

let cacheData = 'appV1';

this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheData).then((cache) => {
            return cache.addAll([
                "/",
                "/index.html",
                "/static/js/bundle.js",
                "/manifest.json",
                "/sw.js",
                "/dashboard",
                "/offers",
                "/companies_list",
                "/send_groupage",
                "/notification",
                "/register_company",
                "/about_us",
                "/login",
                "/reset_password",       // fallback for dynamic route
                "/company_details"       // fallback for dynamic route
            ]);
        }).catch((error) => {
            console.error("Caching failed:", error);
        })
    );
});

this.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // You can return a fallback page here if needed
                return caches.match("/index.html");
            });
        })
    );
});
