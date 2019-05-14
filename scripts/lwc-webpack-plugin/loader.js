'use strict';

const path = require('path');
const { transform } = require('@lwc/compiler');

module.exports = async function loader(source) {
    const { resourcePath } = this;
    const ext = path.extname(resourcePath);
    const basename = path.basename(resourcePath, ext);
    const extMap = {
        ...this.query.extMap,
        '.js': '.js',
        '.css': '.css',
        '.html': '.html',
    };
    const mappedExt = extMap[ext];

    if (mappedExt === undefined) {
        throw new Error(
            `[lwc-loader] Cannot transform file with extension "${ext}". Please map "${ext}" to ".js", ".html" or ".css" in options.extMap`,
        );
    }

    const fileName = path.basename(resourcePath).replace(ext, mappedExt);

    const { code } = await transform(source, fileName, {
        namespace: this.query.namespace,
        name: basename,
    });

    return code;
};
