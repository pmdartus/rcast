'use strict'; 

/**
 * More details:
 * https://affiliate.itunes.apple.com/resources/blog/introduction-rss-feed-generator/
 */
const { URL } = require('url');

const request = require('../utils/request');
const { Cache } = require('../utils/cache');
const { ServiceUnavailable } = require('../utils/http-error');

const RESPONSE_CACHE = new Cache({
    stdTTL: 60 * 60 // 1 hour
});

async function top({ genreId, country }) {
    const url = `https://itunes.apple.com/${country}/rss/toppodcasts/genre=${genreId}/json`;
    
    const cachedResult = RESPONSE_CACHE.get(url);
    if (cachedResult !== undefined) {
        return cachedResult;
    }

    const response = await request(url);

    if (response.statusCode !== 200) {
        throw new ServiceUnavailable();
    }

    const parsedBody = JSON.parse(response.body);
    const result = parsedBody.feed.entry.map(resultEntryToPodcast);

    RESPONSE_CACHE.set(url, result);

    return result;
}

function resultEntryToPodcast(entry) {
    const entryArtistField = entry['im:artist'];

    // Some of the artists doesn't have an associated id.
    const author = {
        id: null,
        name: entryArtistField.label,
    };

    if (entryArtistField.attributes) {
        // API doesn't provide the artist id directly but it can be guessed from the artist
        // url. For example:
        // https://itunes.apple.com/us/artist/npr/125443881?mt=2&uo=2
        const artistUrl = new URL(entryArtistField.attributes.href);
        author.id = artistUrl.pathname.split('/').pop();
    }

    const image = entry['im:image'].find(image => {
        return image.attributes.height === '170';
    }).label;

    return {
        id: entry.id.attributes['im:id'],
        name: entry['im:name'].label,
        image,
        author,
    };
}

module.exports = {
    top,
};