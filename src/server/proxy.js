'use strict';

const request = require('request');

const REQUEST_CONFIG = {
    // Avoid SSL certifications issues.
    rejectUnauthorized: false,
};

module.exports = function proxyHandler(req, res, next) {
    const streamUrl = decodeURIComponent(req.params[0]);

    const requestConfig = {
        ...REQUEST_CONFIG,

        // Forward headers to enable partial file download for streaming
        headers: req.headers, 
    };

    const handleError = err => {
        const { code } = err;

        if (code === 'ECONNRESET' || code === 'ECONNREFUSED') {
            return res.sendStatus(503);
        }

        return next(err);
    };

    request(streamUrl, requestConfig)
        .on('error', handleError)
        .pipe(res);
}