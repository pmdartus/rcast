'use strict';

const path = require('path');
const workboxBuild = require('workbox-build');

const { DIST_DIR } = require('./shared');

workboxBuild.generateSW({
    // Generate service worker at the root
    swDest: path.resolve(DIST_DIR, 'sw.js'),

    // Find all the artifact to prefetch
    globDirectory: DIST_DIR,
    globPatterns: ['**/*.{html,js,json}'],

    // Use the common application shell for all the pages.
    navigateFallback: '/index.html',

    runtimeCaching: [
        {
            urlPattern: /api/,
            handler: 'networkFirst',
            options: {
                cacheName: 'api-cache',
            },
        },
        {
            urlPattern: new RegExp('^https://.+.mzstatic.com/image/'),
            handler: 'staleWhileRevalidate',
            options: {
                cacheName: 'image-cache',
            },
        },
    ],
});
