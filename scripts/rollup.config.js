'use strict';

const { execSync } = require('child_process');

const lwc = require('@lwc/rollup-plugin');
const replace = require('@rollup/plugin-replace');
const { terser } = require('rollup-plugin-terser');
const resolve = require('@rollup/plugin-node-resolve');

const html = require('./plugin-html');
const cleanup = require('./plugin-cleanup');
const copyAssets = require('./plugin-copy-assets');
const serviceWorker = require('./plugin-service-worker');

const { __PROD__ } = require('./shared');

const COMMIT_HASH = execSync('git rev-parse HEAD')
    .toString()
    .trim();

module.exports = {
    input: 'src/main.js',

    output: {
        dir: 'dist',
        entryFileNames: 'entry-[name]-[hash].js',
        format: 'esm',
        sourcemap: true,
    },

    manualChunks(id) {
        if (id.includes('node_modules')) {
            return 'vendor';
        }
    },

    plugins: [
        cleanup(),
        html(),
        copyAssets(),
        resolve(),
        lwc({
            exclude: ['**/*.mjs'],
            rootDir: 'src/modules',
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.COMMIT_HASH': JSON.stringify(COMMIT_HASH),
            'process.env.RELEASE_DATE': JSON.stringify(Date.now()),
        }),
        serviceWorker(),
        __PROD__ && terser(),
    ],
};
