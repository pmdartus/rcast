const API_URL = `https://api.spreaker.com`;
const API_VERSION = 'v2';
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
    const url = `${API_URL}/${API_VERSION}/${path}`;

    let response;
    try {
        response = await fetch(API_URL + path);
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

export function getCuratedLists() {
    return fetchSpreakerApi(`/explore/lists`);
}

export function getCuratedListItems(listId, limit = LIST_SIZE) {
    return fetchSpreakerApi(`/explore/lists/${listId}/items?limit=${limit}`);
}
