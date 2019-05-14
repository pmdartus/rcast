'use strict';

const path = require('path');

module.exports = class Plugin {
    constructor(config) {
        this.config = config;
    }

    apply(compiler) {
        compiler.hooks.afterPlugins.tap('lwc-webpack-plugin', compiler => {
            compiler.options.module.rules.push(
                {
                    test: /(css|html)$/,
                    include: [this.config.directory, path.resolve(__dirname, '../lwc-webpack-resolver/defaults')],
                    loader: require.resolve('./loader'),
                },
                {
                    test: /\.(js?)$/,
                    include: [this.config.directory],
                    loader: require.resolve('babel-loader'),
                    options: {
                        plugins: ['@lwc/babel-plugin-component'],
                    },
                },
            );
        });
    }
};
