'use strict';

/**
 * More details:
 * https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/
 */

const { URL } = require('url');

const request = require('../utils/request');
const { Cache } = require('../utils/cache');
const { ServiceUnavailable } = require('../utils/http-error');

const BASE_URL = 'https://itunes.apple.com';
const RESPONSE_CACHE = new Cache({
    stdTTL: 60 * 60, // 1 hour
});

function search(params) {
    return requestApi('/search', params);
}

function lookup(id) {
    return requestApi('/lookup', { id });
}

async function requestApi(endpoint, params) {
    const url = new URL(endpoint, BASE_URL);
    for (const [name, value] of Object.entries(params)) {
        url.searchParams.set(name, value);
    }

    const strUrl = url.toString();

    const cachedResult = RESPONSE_CACHE.get(strUrl);
    if (cachedResult !== undefined) {
        return cachedResult;
    }

    const response = await request(strUrl);

    if (response.statusCode !== 200) {
        throw new ServiceUnavailable();
    }

    const parsedBody = JSON.parse(response.body);
    const result = parsedBody.results.map(resultEntryToPodcast);

    RESPONSE_CACHE.set(strUrl, result);

    return result;
}

function resultEntryToPodcast(entry) {
    return {
        id: entry.collectionId,
        name: entry.collectionName,
        image: entry.artworkUrl100,

        author: {
            id: entry.artistId,
            name: entry.artistName,
        },

        feedUrl: entry.feedUrl,
    };
}

module.exports = {
    search,
    lookup,
};
