'use strict';

const fs = require('fs');

module.exports = () => ({
    name: 'html',
    buildStart() {
        this.addWatchFile('src/index.html');
    },
    generateBundle(options, bundle) {
        let source = fs.readFileSync('src/index.html', 'utf-8');

        const moduleEntry = Object.values(bundle).find(entry => entry.type === 'chunk' && entry.isEntry);
        const modulesToPreload = Object.values(bundle).filter(entry => entry.type === 'chunk' && !entry.isEntry);

        source = source.replace(
            '<!-- MODULE_ENTRY -->',
            `<script type="module" src="/${moduleEntry.fileName}"></script>`,
        );
        source = source.replace(
            '<!-- MODULES_PRELOAD -->',
            modulesToPreload.map(chunk => `<link rel="modulepreload" href="/${chunk.fileName}">`).join('\n'),
        );

        this.emitFile({
            type: 'asset',
            source,
            name: 'HTML Asset',
            fileName: 'index.html',
        });
    },
});
