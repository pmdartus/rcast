'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');

const common = require('./webpack.common.js');

const APP_PORT = 3000;
const SERVER_PORT = 3001;

module.exports = merge(common, {
    mode: 'development',

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
            },
        }),
    ],

    devServer: {
        // Set dev server port
        port: APP_PORT,

        // Serve all the requests using GZIP to emulate production
        compress: true,

        // Let application alway serve index.html
        historyApiFallback: true,

        // Proxy all the application requests to the application server
        proxy: {
            '/api': `http://localhost:${SERVER_PORT}`,
            '/proxy': `http://localhost:${SERVER_PORT}`,
        },

        after() {
            // Start application server once compilation is done
            const server = require('../src/server/server');
            server.listen(SERVER_PORT, () => {
                // eslint-disable-next-line no-console
                console.log(`Server is running at: http://localhost:${SERVER_PORT}/`);
            });
        },
    },
});
