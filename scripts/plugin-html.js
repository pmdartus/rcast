'use strict';

const fs = require('fs');

// Returns the application entry point.
function getEntryChunk(bundle) {
    return Object.values(bundle).find(entry => entry.type === 'chunk' && entry.isEntry);
}

// Returns the chunks that need to be preloaded with the rest of the application.
// The modules to preload are all the modules that are statically imported from the entry module.
function getModulesToPreload(entryChunk, bundle) {
    const toProcess = [entryChunk];
    const toPreload = {};

    while (toProcess.length > 0) {
        const chunk = toProcess.shift();

        const { imports } = bundle[chunk.fileName];

        // Module might have circular dependencies. If the chunk is already present in the toPreload
        // object it means that it's dependencies have already been processed.
        if (!toPreload[chunk.fileName]) {
            toPreload[chunk.fileName] = chunk;
            toProcess.push(...imports.map(fileName => bundle[fileName]));
        }
    }

    return Object.values(toPreload);
}

module.exports = () => ({
    name: 'html',
    buildStart() {
        this.addWatchFile('src/index.html');
    },
    generateBundle(options, bundle) {
        let source = fs.readFileSync('src/index.html', 'utf-8');

        const entryChunk = getEntryChunk(bundle);
        const modulesToPreload = getModulesToPreload(entryChunk, bundle);

        source = source.replace(
            '<!-- MODULE_ENTRY -->',
            `<script type="module" src="/${entryChunk.fileName}"></script>`,
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
