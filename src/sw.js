import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(process.env.WORKBOX_MANIFEST);

registerRoute(
    /.*\.cloudfront\.net\/.*\.(?:png|jpg)$/,
    new CacheFirst({
        cacheName: 'covers',
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    }),
);
