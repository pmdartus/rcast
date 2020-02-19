import { ExpirationPlugin } from 'workbox-expiration';
import { RangeRequestsPlugin } from 'workbox-range-requests';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { precacheAndRoute, matchPrecache } from 'workbox-precaching';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { StaleWhileRevalidate, NetworkOnly, CacheFirst } from 'workbox-strategies';

const TEN_DAYS_IN_SECONDS = 10 * 24 * 60 * 60;

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
                maxAgeSeconds: TEN_DAYS_IN_SECONDS,
                purgeOnQuotaError: true,
            }),
        ],
    }),
);

// Register route for all the request going through the proxy. THe application uses the proxy to
// get around CORS limitations. This route uses a cache first strategy and store the episodes for
// a maximum of 10 days.
registerRoute(
    /^https:\/\/cors-anywhere\.herokuapp\.com/,
    new CacheFirst({
        cacheName: 'episodes',
        plugins: [
            new CacheableResponsePlugin({ statuses: [200] }),
            new RangeRequestsPlugin(),
            new ExpirationPlugin({
                maxAgeSeconds: TEN_DAYS_IN_SECONDS,
                purgeOnQuotaError: true,
            }),
        ],
    }),
);
