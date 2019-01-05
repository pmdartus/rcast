/* eslint-disable no-console */

'use strict';

const path = require('path');
const workboxBuild = require('workbox-build');

const { DIST_DIR } = require('./shared');

const swDest = path.resolve(DIST_DIR, 'sw.js');

workboxBuild
    .generateSW({
        // Generate service worker at the root
        swDest,

        // Find all the artifact to prefetch
        globDirectory: DIST_DIR,
        globPatterns: ['**/*.{html,js,json}'],

        // Use the common application shell for all the pages.
        navigateFallback: '/index.html',

        runtimeCaching: [
            {
                // Api request caching
                urlPattern: /api/,
                handler: 'networkFirst',
                options: {
                    cacheName: 'api-cache',
                },
            },
            {
                // Podcast cover images stored on apple CDN
                urlPattern: new RegExp('^https://.+.mzstatic.com/image/'),
                handler: 'staleWhileRevalidate',
                options: {
                    cacheName: 'image-cache',
                },
            },
        ],
    })
    .then(({ count, size, warnings }) => {
        for (const warning of warnings) {
            console.warn(`[⚠️ WARNING] ${warning}`);
        }

        console.log(`Generated service worker at ${swDest}`);
        console.log(`    - entries: ${count}`);
        console.log(`    - size: ${Math.round(size / 1000)} kb`);
    })
    .catch(err => {
        console.error(err);
    });
