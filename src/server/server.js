'use strict';

const path = require('path');

const morgan = require('morgan');
const express = require('express');
const request = require('request');

const apiRouter = require('./api');

const __ENV__ = process.env.NODE_ENV || 'development';
const DIST_DIR = path.resolve(__dirname, '../../dist');

const app = express();

// Logger, disabled for testing.
if (__ENV__ !== 'test') {
    app.use(morgan(__ENV__ ? 'dev' : 'common'));
}

// Static file server for the single page application
app.use(express.static(DIST_DIR));

// API endpoints
app.use('/api/1', apiRouter);

// Since some of the podcast enclosed URL doesn't provide CORS headers, we use this endpoint as a proxy to get around
// the same origin policy.
app.get('/api/stream/*', (req, res) => {
    const streamUrl = decodeURIComponent(req.params[0]);
    request(streamUrl).pipe(res);
});

module.exports = app;