'use strict';

const path = require('path');
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
        replace({
            'process.env.NODE_ENV': JSON.stringify(__ENV__),
        }),
        copy({
            [path.resolve(SRC_DIR, 'index.html')]: path.resolve(
                DIST_DIR,
                'index.html',
            ),
        }),
    ],
};
