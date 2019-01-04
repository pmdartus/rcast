'use strict';

const path = require('path');

const lwc = require('@lwc/rollup-plugin');
const alias = require('rollup-plugin-alias');
const replace = require('rollup-plugin-replace');
const { terser } = require('rollup-plugin-terser');
const resolve = require('rollup-plugin-node-resolve');

const packageJSON = require('../package.json');
const { __ENV__, __PROD__ } = require('./shared');

const assets = require('./rollup-plugin-assets');

const SRC_DIR = path.resolve(__dirname, '../src/client');
const DIST_DIR = path.resolve(__dirname, '../dist');

module.exports = {
    input: [path.resolve(SRC_DIR, 'main.js')],

    // Instead of creating an optimal set of chunks, we minize the number of chunks.
    // Value setup manually based on experiment.
    chunkGroupingSize: 500 * 1000,
    experimentalOptimizeChunks: true,

    output: {
        dir: path.resolve(DIST_DIR, 'js'),

        format: 'es',
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',

        sourcemap: true,
    },

    plugins: [
        lwc({
            rootDir: path.resolve(SRC_DIR, 'modules'),

            // Disabled because the glob on `node_modules/` is really expensive. Doing the `lwc` module resolutation
            // manually.
            resolveFromPackages: false,
        }),
        alias({
            lwc: require.resolve('@lwc/engine/dist/modules/es2017/engine.js'),
        }),
        resolve({
            modulesOnly: true,
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(__ENV__),
            'process.env.RELEASE_VERSION': JSON.stringify(packageJSON.version),
            'process.env.RELEASE_DATE': JSON.stringify(new Date().toLocaleDateString('en-US')),
        }),
        __PROD__ && terser(),
        assets(),
    ].filter(Boolean),
};
