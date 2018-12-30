/* eslint-env node */

'use strict';

const path = require('path');

const lwc = require('@lwc/rollup-plugin');
const copy = require('rollup-plugin-copy');
const alias = require('rollup-plugin-alias');
const replace = require('rollup-plugin-replace');
const { terser } = require('rollup-plugin-terser');
const resolve = require('rollup-plugin-node-resolve');

const packageJSON = require('./package.json');

const SRC_DIR = path.resolve(__dirname, './src/client');
const DIST_DIR = path.resolve(__dirname, './dist');

const __ENV__ = process.env.NODE_ENV || 'development';
const __PROD__ = __ENV__ === 'production';

module.exports = {
    input: path.resolve(SRC_DIR, 'index.js'),

    output: {
        file: path.resolve(DIST_DIR, 'public/index.js'),
        format: 'es',
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
        copy({
            [path.resolve(SRC_DIR, 'index.html')]: path.resolve(
                DIST_DIR,
                'index.html',
            ),
            [path.resolve(SRC_DIR, 'public/')]: path.resolve(
                DIST_DIR,
                'public/',
            ),
        }),
        __PROD__ && terser(),
    ].filter(Boolean),
};
