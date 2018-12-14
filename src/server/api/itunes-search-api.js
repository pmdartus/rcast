'use strict';

/**
 * More details:
 * https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/
 */

const { URL } = require('url');

const request = require('request');
const { ServiceUnavailable } = require('../utils/http-error');

const BASE_URL = 'https://itunes.apple.com';

function search(params, callback) {
    return requestApi('/search', params, callback);
}

function lookup(id, callback) {
    return requestApi('/lookup', { id }, callback);
}

function requestApi(endpoint, params, callback) {
    const url = new URL(endpoint, BASE_URL);

    for (const [name, value] of Object.entries(params)) {
        url.searchParams.set(name, value);
    }

    return request(
        url.toString(),
        (err, response, body) => {
            if (err) {
                return callback(err);
            }

            if (response.statusCode !== 200) {
                return callback(new ServiceUnavailable());
            }

            const parsedBody = JSON.parse(body);
            const result = parsedBody.results.map(resultEntryToPodcast);

            callback(null, result);
        },
    );
}

function resultEntryToPodcast(entry) {
    return {
        id: entry.collectionId,
        name: entry.collectionName,
        primaryGenreName: entry.primaryGenreName,
        releaseDate: entry.releaseDate,
        feedUrl: entry.feedUrl,

        artist: {
            id: entry.artistId,
            name: entry.artistName,
        },

        cover: {
            small: entry.artworkUrl60,
            medium: entry.artworkUrl100,
            large: entry.artworkUrl600,
        },
    };
}

module.exports = {
    search,
    lookup,
};
