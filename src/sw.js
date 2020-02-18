import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { precacheAndRoute, matchPrecache } from 'workbox-precaching';
import { StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';

// Notes:
//  - No need to cache cover image, the CDN used by spreaker API marks the cover images immutable
//    and cacheable for 1 year.

const networkOnly = new NetworkOnly();

// Download and cache assets when the server worker is installed. The WORKBOX_MANIFEST environment
// variable is injected at build time by the service-worker plugin.
precacheAndRoute(process.env.WORKBOX_MANIFEST);

// Register route for all the browser navigation requests (when Request.mode === 'navigate').
// Using a network first approach to make sure the HTML file is alway up to date when online, but
// fallback to the precached index file when offline.
registerRoute(
    new NavigationRoute(async params => {
        try {
            return await networkOnly.handle(params);
        } catch {
            return matchPrecache('/index.html');
        }
    }),
);

// Register router for all the spreaker.com API requests.
// Using a stale while revalidate approach to keep the data up to date when online. Cache all the
// API response for 10 days max.
registerRoute(
    /^https:\/\/api.spreaker.com/,
    new StaleWhileRevalidate({
        cacheName: 'spreaker-api',
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 10 * 24 * 60 * 60, // 10 Days
            }),
        ],
    }),
);
