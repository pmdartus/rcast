/* globals clients */

import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { precacheAndRoute, matchPrecache } from 'workbox-precaching';
import { StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';

import { isEpisodeDownloadFetchId, getEpisodeId } from 'rcast/download';
import { EPISODES_CACHE_NAME, SPREAKER_API_CACHE_NAME } from 'sw/shared';

const TEN_DAYS_IN_SECONDS = 10 * 24 * 60 * 60;

// Notes:
//  - No need to cache cover image, the CDN used by spreaker API marks the cover images immutable
//    and cacheable for 1 year.

const networkOnly = new NetworkOnly();

addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        // eslint-disable-next-line
        skipWaiting();
    }
});

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
        cacheName: SPREAKER_API_CACHE_NAME,
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: TEN_DAYS_IN_SECONDS,
                purgeOnQuotaError: true,
            }),
        ],
    }),
);

addEventListener('backgroundfetchsuccess', event => {
    const bgFetch = event.registration;

    event.waitUntil(
        (async () => {
            const downloadCache = await caches.open(EPISODES_CACHE_NAME);
            const records = await bgFetch.matchAll();

            await Promise.all(
                records.map(async record => {
                    const response = await record.responseReady;
                    await downloadCache.put(record.request, response);
                }),
            );

            event.updateUI({ title: 'Episode ready to be listened!' });
        })(),
    );
});

addEventListener('backgroundfetchfailure', event => {
    event.updateUI({ title: 'Failed to download episode!' });
});

addEventListener('backgroundfetchclick', event => {
    const bgFetch = event.registration;

    if (isEpisodeDownloadFetchId(bgFetch.id)) {
        const episodeId = getEpisodeId(bgFetch.id);
        clients.openWindow(`/episodes/${episodeId}`);
    }
});
