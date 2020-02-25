const API_BASE = `https://api.spreaker.com/v2`;
const LIST_SIZE = 25;

export class OfflineError extends Error {
    name = 'OfflineError';

    constructor(url) {
        super(`Can't access "${url}" while offline`);
    }
}

export class UnexpectedServerResponseError extends Error {
    name = 'UnexpectedServerResponseError';

    constructor(url, status) {
        super(`Unexpected status ${status} response for "${url}"`);
    }
}

async function fetchSpreakerApi(path) {
    const url = API_BASE + path;

    let response;
    try {
        response = await fetch(API_BASE + path);
    } catch {
        throw new OfflineError(url);
    }

    if (!response.ok) {
        throw new UnexpectedServerResponseError(url, response.status);
    }

    return response.json();
}

export function fetchEpisode(episodeId) {
    return fetchSpreakerApi(`/episodes/${episodeId}`);
}

export function fetchShow(showId) {
    return fetchSpreakerApi(`/shows/${showId}`);
}

export function fetchShowEpisodes(showId) {
    return fetchSpreakerApi(`/shows/${showId}/episodes?limit=${LIST_SIZE}`);
}

export function fetchCategory(categoryId) {
    return fetchSpreakerApi(`/explore/categories/${categoryId}/items?limit=${LIST_SIZE}`);
}
