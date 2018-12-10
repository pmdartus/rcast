/* eslint-env node */

'use strict';

const path = require('path');
const lwc = require('@lwc/rollup-plugin');
const copy = require('rollup-plugin-copy');
const replace = require('rollup-plugin-replace');

const SRC_DIR = path.resolve(__dirname, './src/client');
const DIST_DIR = path.resolve(__dirname, './dist');

const __ENV__ = process.env.NODE_ENV || 'development';

module.exports = {
    input: path.resolve(SRC_DIR, 'index.js'),

    output: {
        file: path.resolve(DIST_DIR, 'index.js'),
        format: 'es',
    },

    plugins: [
        lwc({
            rootDir: path.resolve(SRC_DIR, 'modules'),
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(__ENV__),
        }),
        copy({
            [path.resolve(SRC_DIR, 'public/index.html')]: path.resolve(
                DIST_DIR,
                'index.html',
            ),
            [path.resolve(SRC_DIR, 'public/svg/')]: path.resolve(
                DIST_DIR,
                'svg/',
            ),
        }),
    ],
};
