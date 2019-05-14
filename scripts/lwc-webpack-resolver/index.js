'use strict';

const path = require('path');

const EMPTY_STYLE = path.resolve(__dirname, 'defaults', 'empty.css');
const EMPTY_TEMPLATE = path.resolve(__dirname, 'defaults', 'empty.html');

// Returns true if the id respect module scheme
function isValidModuleName(id) {
    return id.match(/^(\w+\/)(\w+)$/);
}

// Returns module name and namespace from id
function getInfoFromId(id) {
    const [ns, ...rest] = id.split('/');
    return {
        ns,
        name: rest.join('/'),
    };
}

module.exports = class Resolver {
    constructor(config) {
        this.config = config;
    }

    apply(resolver) {
        resolver.hooks.module.tapAsync('lwc-module-resolver', (req, ctx, cb) =>
            this.resolveModule(resolver, req, ctx, cb),
        );

        resolver.hooks.file.tapAsync('lwc-file-resolver', (req, ctx, cb) => this.resolveFile(resolver, req, ctx, cb));
    }

    resolveModule(resolver, req, ctx, cb) {
        const { fileSystem } = resolver;
        const { directory } = this.config;

        const { request, query } = req;

        if (!isValidModuleName(request)) {
            return cb();
        }

        const { ns, name } = getInfoFromId(request);
        const lwcModuleEntry = path.resolve(directory, ns, name, `${name}.js`);

        fileSystem.stat(lwcModuleEntry, err => {
            if (err !== null && err.code === 'ENOENT') {
                return cb();
            }

            return cb(err, {
                path: lwcModuleEntry,
                query,
                file: true,
                resolved: true,
            });
        });
    }

    resolveFile(resolver, req, ctx, cb) {
        const { fileSystem } = resolver;

        const { path: resourcePath, query } = req;

        let potentialDefault;

        const ext = path.extname(resourcePath);
        if (ext === '.css') {
            potentialDefault = EMPTY_STYLE;
        } else if (ext === '.html') {
            potentialDefault = EMPTY_TEMPLATE;
        }

        if (potentialDefault === undefined) {
            return cb();
        }

        fileSystem.stat(resourcePath, err => {
            if (err !== null && err.code === 'ENOENT') {
                return cb(null, {
                    path: potentialDefault,
                    query,
                    file: true,
                    resolved: false,
                });
            }

            return cb();
        });
    }
};
