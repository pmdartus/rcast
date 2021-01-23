'use strict';

const workbox = require('workbox-build');

const { rollup } = require('rollup');
const replace = require('@rollup/plugin-replace');
const { terser } = require('rollup-plugin-terser');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

const { __PROD__ } = require('./shared');

module.exports = () => ({
    name: 'service-worker',
    buildStart() {
        this.addWatchFile('src/sw.js');
    },
    async writeBundle() {
        const manifest = await workbox.getManifest({
            globDirectory: 'dist/',
            globPatterns: ['*.{html,js,json}', 'icons/*.png'],
        });

        for (const warning of manifest.warnings) {
            this.warn(warning);
        }

        // Correct manifest information:
        //  - add the `/` to make URL relative to the root
        //  - remove revision from javascript file because the file name already have their revision encoded in their
        //    filename.
        manifest.manifestEntries = manifest.manifestEntries.map((entry) => ({
            ...entry,
            url: `/${entry.url}`,
            revision: entry.url.endsWith('.js') ? null : entry.revision,
        }));

        const bundle = await rollup({
            input: 'src/sw.js',
            plugins: [
                nodeResolve(),
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
