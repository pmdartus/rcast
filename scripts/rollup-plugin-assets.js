'use strict';

const fs = require('fs');
const path = require('path');

const cpy = require('cpy');

const { SRC_DIR, DIST_DIR } = require('./shared');

function buildHTML(bundle) {
    let htmlContent = fs.readFileSync(path.resolve(SRC_DIR, 'index.html'), 'utf-8');

    const mainName = Object.keys(bundle).find(name => name.startsWith('main-') && bundle[name].isEntry);
    const mainChunk = bundle[mainName];

    htmlContent = htmlContent.replace(
        '{{HEADER}}',
        mainChunk.dynamicImports
            .map(moduleName => `<link rel="prefetch" href="/js/${moduleName}" as="script">`)
            .join('\n'),
    );
    htmlContent = htmlContent.replace(
        '{{FOOTER}}',
        [
            `<script type="module" src="/js/${mainName}"></script>`,
            ...mainChunk.imports.map(moduleName => `<script type="module" src="/js/${moduleName}"></script>`),
        ].join('\n'),
    );

    fs.writeFileSync(path.resolve(DIST_DIR, 'index.html'), htmlContent);
}

module.exports = function assetsPlugin() {
    return {
        async generateBundle(_options, bundle) {
            await cpy('**', DIST_DIR, {
                cwd: path.resolve(SRC_DIR, 'assets'),
                parents: true,
            });
            await buildHTML(bundle);
        },
    };
};
