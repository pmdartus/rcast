'use strict';

/**
 * Apple doesn't provide the DTD for the podcast anymore. More details about the actual format can be found here:
 * https://help.apple.com/itc/podcasts_connect/#/itcb54353390
 */

const { Readable } = require('stream');
const FeedParser = require('feedparser');
const sanitizeHTML = require('sanitize-html');

const request = require('../utils/request');
const { Cache } = require('../utils/cache');
const { ServiceUnavailable } = require('../utils/http-error');

const RESPONSE_CACHE = new Cache({
    stdTTL: 60 * 60, // 1 hour
});

function getPodcastInfo(url) {
    return fetchFeed(url).then(content => parseFeed(content, url));
}

async function fetchFeed(url) {
    const cachedResult = RESPONSE_CACHE.get(url);
    if (cachedResult !== undefined) {
        return cachedResult;
    }

    const response = await request(url);

    if (response.statusCode !== 200) {
        throw ServiceUnavailable();
    }

    RESPONSE_CACHE.set(url, response.body);

    return response.body;
}

function parseFeed(content, url) {
    const feedParser = new FeedParser({
        feedurl: url,
        normalize: true,
    });

    let podcast = {};
    const episodes = [];

    return new Promise((resolve, reject) => {
        feedParser.on('error', function(error) {
            reject(error);
        });

        feedParser.on('meta', function() {
            const { meta } = this;

            podcast = {
                name: meta.title,
                subtitle: getOrNul(meta, 'itunes:subtitle', '#'),
                description: getOrNul(meta, 'itunes:description', '#') || getOrNul(meta, 'description'),
                author: getOrNul(meta, 'itunes:author', '#'),
                language: getOrNul(meta, 'rss:language', '#') || getOrNul(meta, 'language'),
                link: getOrNul(meta, 'rss:link', '#') || getOrNul(meta, 'link'),
                image: getOrNul(meta, 'itunes:image', '#') || getOrNul(meta, 'image', 'url'),
                categories: getOrNul(meta, 'categories') || [],
            };
        });

        feedParser.on('readable', function() {
            try {
                const item = this.read();

                if (item) {
                    const enclosure = item.enclosures[0];

                    episodes.push({
                        id: getOrNul(item, 'guid'),
                        title: getOrNul(item, 'title'),
                        description: sanitizeHTML(getOrNul(item, 'description') || getOrNul(item, 'summary') || ''),
                        publication_date:
                            getOrNul(item, 'pubDate') || getOrNul(item, 'pubdate') || getOrNul(item, 'date'),
                        duration: durationToSecond(
                            getOrNul(item, 'itunes:duration', '#') || getOrNul(item, 'duration') || '0',
                        ),
                        image: getOrNul(item, 'itunes:image', '#') || getOrNul(item, 'image', 'url'),
                        audio: {
                            url: getOrNul(enclosure, 'url'),
                            type: getOrNul(enclosure, 'type'),
                            length: getOrNul(enclosure, 'length'),
                        },
                    });
                }
            } catch (error) {
                reject(error);
            }
        });

        feedParser.on('end', function() {
            resolve({
                ...podcast,
                episodes,
            });
        });

        // Convert string to ReadableStream to be ingested by the feedparser
        const stream = new Readable();
        stream.push(content);
        stream.push(null);

        stream.pipe(feedParser);
    });
}

function getOrNul(obj, ...props) {
    let val = obj;

    for (const prop of props) {
        val = val[prop];

        if (val === undefined) {
            return null;
        }
    }

    return val;
}

// More details about the supported formats in the `<itunes:duration>` section.
// https://help.apple.com/itc/podcasts_connect/#/itcb54353390
function durationToSecond(str) {
    if (str.includes(':')) {
        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        const values = str.split(':');

        if (values.length === 3) {
            [hours, minutes, seconds] = values;
        } else if (values.length === 2) {
            [minutes, seconds] = values;
        } else {
            throw new Error(`Unknown duration format for ${str}`);
        }

        return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
    }
    if (str.includes('.')) {
        const [minutes, seconds] = str.split('.');
        return parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
    } else {
        return parseInt(str, 10);
    }
}

module.exports = {
    getPodcastInfo,
};
