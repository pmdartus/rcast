'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const packageJSON = require('../package.json');
const LWCWebpackPlugin = require('./lwc-webpack-plugin');
const LWCWebpackResolver = require('./lwc-webpack-resolver');

const { SRC_DIR, DIST_DIR } = require('./shared');

module.exports = {
    entry: path.resolve(SRC_DIR, './main.js'),
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: DIST_DIR,

        // Set output public path
        publicPath: '/',
    },

    plugins: [
        // Clean up the dist directory between consecutive builds
        new CleanWebpackPlugin(),

        // Add LWC plugin from module compilation
        new LWCWebpackPlugin({
            directory: path.resolve(SRC_DIR, './modules'),
            extension: '.js',
        }),

        // Set environment variables
        new webpack.EnvironmentPlugin({
            RELEASE_VERSION: JSON.stringify(packageJSON.version),
            RELEASE_DATE: JSON.stringify(new Date().toLocaleDateString('en-US')),
        }),

        // Generate HTML entry point
        new HtmlWebpackPlugin({
            template: path.resolve(SRC_DIR, './index.html'),
        }),

        // Copy project assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(SRC_DIR, './assets'),
            },
        ]),
    ],

    resolve: {
        // Specify known package aliases
        alias: {
            lwc: '@lwc/engine',
            'wire-service': '@lwc/wire-service',
        },

        plugins: [
            // Register resolver to resolve LWC modules
            new LWCWebpackResolver({
                directory: path.resolve(SRC_DIR, './modules'),
            }),
        ],
    },

    optimization: {
        // Default chunk splitting heuristic
        splitChunks: {
            chunks: 'all',
        },
    },
};
