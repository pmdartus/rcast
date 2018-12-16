'use strict';

const path = require('path');

const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const request = require('request');
const compression = require('compression');

const apiRouter = require('./api');

const __ENV__ = process.env.NODE_ENV || 'development';
const DIST_DIR = path.resolve(__dirname, '../../dist');

const app = express();

// Logger, disabled for testing.
if (__ENV__ !== 'test') {
    app.use(morgan(__ENV__ ? 'dev' : 'common'));
}

// Disable certain HTTP headers.
app.use(helmet());

// GZip all the responses.
app.use(compression());

// Match static files requests
const publicDir = path.resolve(DIST_DIR, 'public');
app.use('/public', express.static(publicDir));

// Since some of the podcast enclosed URL doesn't provide CORS headers, we use this endpoint as a proxy to get around
// the same origin policy.
app.get('/proxy/*', (req, res) => {
    const streamUrl = decodeURIComponent(req.params[0]);
    request(streamUrl).pipe(res);
});

// Match API requests
app.use('/api/1', apiRouter);

// Match all the other requests
app.use('*', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

module.exports = app;
