'use strict';

const lwc = require('@lwc/rollup-plugin');
const replace = require('@rollup/plugin-replace');
const { terser } = require('rollup-plugin-terser');
const resolve = require('@rollup/plugin-node-resolve');

const cleanup = require('./plugin-cleanup');
const copyAssets = require('./plugin-copy-assets');

const packageJSON = require('../package.json');

const __PROD__ = process.env.NODE_ENV === 'production';

module.exports = {
    input: 'src/main.js',
    output: {
        dir: 'dist',
        format: 'esm',
    },
    plugins: [
        cleanup(),
        copyAssets(),
        resolve(),
        lwc({
            rootDir: 'src/modules',
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.RELEASE_VERSION': JSON.stringify(packageJSON.version),
            'process.env.RELEASE_DATE': JSON.stringify(new Date().toLocaleDateString('en-US')),
        }),
        __PROD__ && terser(),
    ],
};
