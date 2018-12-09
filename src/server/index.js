'use strict';

const path = require('path');

const morgan = require('morgan');
const express = require('express');
const request = require('request');

const PORT = process.env.PORT || 3000;
const __ENV__ = process.env.NODE_ENV || 'development';
const DIST_DIR = path.resolve(__dirname, '../../dist');

const app = express();

// Logger
app.use(morgan(__ENV__ ? 'dev' : 'common'));

// Static file server
app.use(express.static(DIST_DIR));

// Since the fyyd api doesn't set the CORS header, we use this server as a proxy to get around the same-origin policy.
// This endpoint forwards the request and it's parameters to the FYYD API.
app.get('/api/fyyd/0.2/*', (req, res) => {
    const fyydEndpoint = req.params[0];
    const fyydRequest = request(`https://api.fyyd.de/0.2/${fyydEndpoint}`, {
        qs: req.query,
    })

    fyydRequest.pipe(res);
});

// Since some of the podcast enclosed URL doesn't provide CORS headers, we use this endpoint as a proxy to get around
// the same origin policy.
app.get('/api/stream/*', (req, res) => {
    const streamUrl = decodeURIComponent(req.params[0]);
    request(streamUrl).pipe(res);
});

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`rcast is ready port ${PORT}!`);
});
