/* eslint-env node */

'use strict';

const fs = require('fs');
const path = require('path');

const cpy = require('cpy');

const lwc = require('@lwc/rollup-plugin');
const alias = require('rollup-plugin-alias');
const replace = require('rollup-plugin-replace');
const { terser } = require('rollup-plugin-terser');
const resolve = require('rollup-plugin-node-resolve');

const packageJSON = require('../package.json');

const SRC_DIR = path.resolve(__dirname, '../src/client');
const DIST_DIR = path.resolve(__dirname, '../dist');

const __ENV__ = process.env.NODE_ENV || 'development';
const __PROD__ = __ENV__ === 'production';

function buildHTML(bundle) {
    let htmlContent = fs.readFileSync(path.resolve(SRC_DIR, 'index.html'), 'utf-8');

    const mainImports = bundle['main.js'];

    htmlContent = htmlContent.replace(
        '{{HEADER}}',
        mainImports.dynamicImports.map(moduleName => `<link rel="modulepreload" href="/js/${moduleName}">`).join('\n'),
    );
    htmlContent = htmlContent.replace(
        '{{FOOTER}}',
        [
            `<script type="module" src="/js/main.js"></script>`,
            ...mainImports.imports.map(moduleName => `<script type="module" src="/js/${moduleName}"></script>`),
        ].join('\n')
    );

    fs.writeFileSync(path.resolve(DIST_DIR, 'index.html'), htmlContent);
}

function assetsPlugin() {
    return {
        async generateBundle(_options, bundle) {
            await cpy('**', DIST_DIR, {
                cwd: path.resolve(SRC_DIR, 'assets'),
                parents: true,
            });
            await buildHTML(bundle);
        },
    };
}

module.exports = {
    input: [path.resolve(SRC_DIR, 'main.js'), path.resolve(SRC_DIR, 'sw.js')],

    // Instead of creating an optimal set of chunks, we minize the number of chunks.
    // Value setup manually based on experiment.
    chunkGroupingSize: 500 * 1000,
    experimentalOptimizeChunks: true,

    output: {
        dir: path.resolve(DIST_DIR, 'js'),
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
        __PROD__ && terser(),
        assetsPlugin(),
    ].filter(Boolean),
};
