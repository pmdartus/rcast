'use strict';

const express = require('express');

const { top } = require('./itunes-top-api');
const { getEpisodes } = require('./podcast-feed');
const { search, lookup } = require('./itunes-search-api');

const { HTTPError, BadRequest, NotFound } = require('./http-error');

const router = express.Router();

router.get('/search', (request, response, next) => {
    const { term } = request.query;

    if (!term) {
        return next(new BadRequest('Missing required "term" query string.'));
    }

    search(
        {
            media: 'podcast',
            term,
        },
        (err, podcasts) => {
            if (err) {
                return next(err);
            }

            return response.send({
                count: podcasts.length,
                results: podcasts,
            });
        },
    );
});

router.get('/top', (request, response, next) => {
    const { genreId, country = 'us' } = request.query;

    if (!genreId) {
        return next(new BadRequest('Missing required "genreId" query string.'));
    }

    top({ genreId, country }, (err, podcasts) => {
        if (err) {
            return next(err);
        }

        return response.send({
            count: podcasts.length,
            results: podcasts,
        });
    });
});

router.get('/podcasts/:id', (request, response, next) => {
    const { id } = request.params;

    lookup(id, (err, podcasts) => {
        if (err) {
            return next(err);
        }

        if (podcasts.length === 0) {
            return next(new NotFound());
        }

        const podcast = podcasts[0];

        getEpisodes(podcast.feedUrl, (err, episodes) => {
            if (err) {
                return next(err);
            }

            response.send({
                ...podcast,
                episodes
            });
        });
    });
});

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

        // TODO: Add logging here with the stack trace for production debugging

        // TODO: Move this check somewhere else?
        if (process.env.NODE_ENV !== 'production') {
            message.error.stack = err.stack;
        }

        return res.status(500).send(message);
    }
});

module.exports = router;
