'use strict';

const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
// const workboxWebpackPlugin = require('workbox-webpack-plugin');

const packageJSON = require('../package.json');
const LWCWebpackPlugin = require('lwc-webpack-plugin');

const { SRC_DIR, DIST_DIR } = require('./shared');

module.exports = {
    entry: path.resolve(SRC_DIR, './main.js'),
    output: {
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        path: DIST_DIR,

        // Set output public path
        publicPath: '/',
    },

    plugins: [
        // Clean up the dist directory between consecutive builds
        new CleanWebpackPlugin(),

        // Add LWC plugin from module compilation
        new LWCWebpackPlugin({
            namespace: {
                base: path.resolve(SRC_DIR, './modules', 'base'),
                rcast: path.resolve(SRC_DIR, './modules', 'rcast'),
                view: path.resolve(SRC_DIR, './modules', 'view'),
                component: path.resolve(SRC_DIR, './modules', 'component'),
                store: path.resolve(SRC_DIR, './modules', 'store'),
            },
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

        new PreloadWebpackPlugin({
            rel: 'prefetch',
        }),

        // Copy project assets
        new CopyWebpackPlugin(
            [
                {
                    from: path.resolve(SRC_DIR, './assets'),
                },
            ],
            {
                // Set to true, to alway regenerate the assets.
                // Useful in watch mode, since the clean up plugin removes the dist folder between each build
                copyUnmodified: true,
            },
        ),

        // TODO: Reenable service worker
        // // Generate service worker
        // new workboxWebpackPlugin.GenerateSW({
        //     swDest: 'sw.js',
        //     clientsClaim: true,
        //     skipWaiting: true,

        //     // Fallback to entry point when navigating to a different page
        //     navigateFallback: '/index.html'
        // })
    ],

    optimization: {
        // Default chunk splitting heuristic
        splitChunks: {
            chunks: 'all',
        },
    },

    stats: {
        // Hide assets copy from the webpack logs
        assets: false,
    },
};
