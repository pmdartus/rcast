'use strict';

const path = require('path');

const helmet = require('helmet');
const express = require('express');
const compression = require('compression');

const apiRouter = require('./api');
const proxyHandler = require('./proxy');
const { __ENV__ } = require('./config');

const { loggerMiddleware, errorLoggerMiddleware } = require('./utils/logger');

const DIST_DIR = path.resolve(__dirname, '../../dist');

const app = express();

// Request logger
if (__ENV__ !== 'test') {
    app.use(loggerMiddleware);
}

// Disable certain HTTP headers.
app.use(helmet());

// GZip all the responses.
app.use(compression());

// Match all the request to serve static assets
app.use(express.static(DIST_DIR));

// Since some of the podcast enclosed URL doesn't provide CORS headers, we use this endpoint as a proxy to get around
// the same origin policy.
app.get('/proxy/*', proxyHandler);

// Match API requests
app.use('/api/1', apiRouter);

// Match all the other requests and return the HTML entry
app.use('*', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

// Error logger
if (__ENV__ !== 'test') {
    app.use(errorLoggerMiddleware);
}

module.exports = app;
