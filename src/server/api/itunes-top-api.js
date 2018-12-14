'use strict'; 

/**
 * More details:
 * https://affiliate.itunes.apple.com/resources/blog/introduction-rss-feed-generator/
 */

const request = require('request');
const { ServiceUnavailable } = require('../utils/http-error');

function top({ genreId, country }, callback) {
    request(
        `https://itunes.apple.com/${country}/rss/toppodcasts/genre=${genreId}/json`,
        (err, response, body) => {
            if (err) {
                return callback(err);
            }

            if (response.statusCode !== 200) {
                return callback(new ServiceUnavailable());
            }

            const parsedBody = JSON.parse(body);
            const result = parsedBody.feed.entry.map(resultEntryToPodcast);

            callback(null, result);
        },
    );
} 

function resultEntryToPodcast(entry) {
    const entryArtistField = entry['im:artist'];

    // Some of the artists doesn't have an associated id.
    const artist = {
        id: null,
        name: entryArtistField.label,
    };

    if (entryArtistField.attributes) {
        // API doesn't provide the artist id directly but it can be guessed from the artist
        // url. For example:
        // https://itunes.apple.com/us/artist/npr/125443881?mt=2&uo=2
        const artistUrl = new URL(entryArtistField.attributes.href);
        artist.id = artistUrl.pathname.split('/').pop();
    }

    const smallCover = entry['im:image'].find(image => {
        return image.attributes.height === '60';
    }).label;
    const mediumCover = entry['im:image'].find(image => {
        return image.attributes.height === '170';
    }).label;

    // The max images size provided by this API is the 170x170.
    const cover = {
        small: smallCover,
        medium: mediumCover,
        large: null
    };

    return {
        id: entry.id.attributes['im:id'],
        name: entry.title.label,
        primaryGenreName: entry.category.attributes.label,
        releaseDate: entry['im:releaseDate'].label,

        artist,
        cover,
    };
}

module.exports = {
    top,
};