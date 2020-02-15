'use strict';

//
const request = require('request');

module.exports = function proxyHandler(req, res, next) {
    const url = decodeURIComponent(req.params[0]);
    const options = {
        rejectUnauthorized: false, // Avoid SSL certifications issues.
        headers: req.headers, // Forward headers to enable partial file download for streaming
    };

    request(url, options)
        .on('error', err => {
            const { code } = err;

            if (code === 'ECONNRESET' || code === 'ECONNREFUSED') {
                return res.sendStatus(503);
            }

            return next(err);
        })
        .pipe(res);
};
