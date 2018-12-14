'use strict';

const request = require('request');
const FeedParser = require('feedparser');
const sanitizeHTML = require('sanitize-html');

function getEpisodes(feedUrl, callback) {
    const feedParser = new FeedParser({
        feedurl: feedUrl,
        normalize: true,
    });
    
    let success = true;
    const episodes = [];

    feedParser.on('error', function(error) {
        success = false;
        return callback(error);
    });

    feedParser.on('readable', function() {
        try {
            const item = this.read();

            if (item) {
                // TODO - This can maybe be improved in the future, we should return the best matching audio file
                // based on it's size and encoding.
                const enclosure = item.enclosures[0];

                episodes.push({
                    id: item.guid,
                    title: item.title,
                    description: sanitizeHTML(item.description || item.summary),
                    publication_date: item.pubDate || item.pubdate || item.date,
                    duration: durationToSecond(item.duration || item['itunes:duration']['#']),
                    audio: {
                        url: enclosure.url,
                        type: enclosure.type,
                        length: enclosure.length,
                    }
                });
            }
        } catch (error) {
            success = false;
            return callback(error);
        }
    });

    feedParser.on('end', function() {
        if (success) {
            return callback(null, episodes);
        }
    });

    request(feedUrl).pipe(feedParser);
}

function durationToSecond(str) {
    if (str.includes(':')) {
        const [hours, minutes, seconds] = str.split(':');
        return (parseInt(hours, 10) * 3600) + (parseInt(minutes, 10) * 60) + parseInt(seconds, 10);
    } else {
        return parseInt(str, 10);
    }
}

module.exports = {
    getEpisodes,
};
