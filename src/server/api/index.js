'use strict';

const express = require('express');

const { top } = require('./itunes-top-api');
const { getPodcastInfo } = require('./podcast-feed');
const { search, lookup } = require('./itunes-search-api');

const { __ENV__ } = require('../config');
const { HTTPError, BadRequest, NotFound } = require('../utils/http-error');

const router = express.Router();

function asyncMiddleware(fn) {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
}

router.get(
    '/search',
    asyncMiddleware(async (request, response) => {
        const { term } = request.query;

        if (!term) {
            throw new BadRequest('Missing required "term" query string.');
        }

        const podcasts = await search({
            media: 'podcast',
            term,
        });

        return response.send({
            count: podcasts.length,
            results: podcasts,
        });
    }),
);

router.get(
    '/top',
    asyncMiddleware(async (request, response) => {
        const { genreId, country = 'us' } = request.query;

        if (!genreId) {
            throw new BadRequest('Missing required "genreId" query string.');
        }

        const podcasts = await top({ genreId, country });

        return response.send({
            count: podcasts.length,
            results: podcasts,
        });
    }),
);

router.get(
    '/podcasts/:id',
    asyncMiddleware(async (request, response) => {
        const { id } = request.params;

        const podcasts = await lookup(id);

        if (podcasts.length === 0) {
            throw new NotFound();
        }

        const podcast = await getPodcastInfo(podcasts[0].feedUrl);

        return response.send({
            ...podcast,
            id,
            author: podcasts[0].author,
        });
    }),
);

// Custom 404 handler for API
// eslint-disable-next-line no-unused-vars
router.use((req, res, next) => {
    next(new NotFound());
});

// Custom error handler for API
// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
    if (err instanceof HTTPError) {
        return res.status(err.code).send({
            error: err.toJSON(),
        });
    } else {
        const message = {
            error: {
                code: 500,
                message: 'Internal Error',
            },
        };

        // Don't log error in test mode, it pollutes the logs
        if (__ENV__ !== 'test') {
            // eslint-disable-next-line no-console
            console.error(err);
        }

        // Attached to the response message, the stack trace in development mode.
        if (__ENV__ !== 'production') {
            message.error.stack = err.stack;
        }

        return res.status(500).send(message);
    }
});

module.exports = router;
