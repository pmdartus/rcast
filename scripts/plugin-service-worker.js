'use strict';

const workbox = require('workbox-build');

const { rollup } = require('rollup');
const replace = require('@rollup/plugin-replace');
const { terser } = require('rollup-plugin-terser');
const resolve = require('@rollup/plugin-node-resolve');

const { __PROD__ } = require('./shared');

module.exports = () => ({
    name: 'service-worker',
    async writeBundle() {
        const manifest = await workbox.getManifest({
            globDirectory: 'dist/',
            globPatterns: ['**/*.{html,js}'],
        });

        for (const warning of manifest.warnings) {
            this.warn(warning);
        }

        // Correct the gathered manifest URLs.
        manifest.manifestEntries = manifest.manifestEntries.map(entry => ({
            ...entry,
            url: `/${entry.url}`,
        }));

        const bundle = await rollup({
            input: 'src/sw.js',
            plugins: [
                resolve(),
                replace({
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                    'process.env.WORKBOX_MANIFEST': JSON.stringify(manifest.manifestEntries, null, 4),
                }),
                __PROD__ && terser(),
            ],
        });

        return bundle.write({
            file: 'dist/sw.js',
            format: 'esm',
        });
    },
});
