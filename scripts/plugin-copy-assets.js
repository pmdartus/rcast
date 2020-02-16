'use strict';

const fs = require('fs-extra');

// Copy the assets to the dist folder.
module.exports = () => ({
    name: 'copy-assets',
    renderStart(options) {
        function copyAssets(config) {
            for (const [src, dest] of Object.entries(config)) {
                fs.copySync(src, `${options.dir}/${dest}`);
            }
        }

        copyAssets({
            'src/index.html': 'index.html',
            'src/assets/favicon.ico': 'favicon.ico',
            'src/assets/manifest.json': 'manifest.json',

            'src/assets/icons/': 'icons/',
            'src/assets/splashscreens/': 'splashscreens/',
            'src/assets/svg/': 'svg/',
        });
    },
});
