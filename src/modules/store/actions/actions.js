import {
    REQUEST_SHOW,
    RECEIVE_SHOW,
    REQUEST_EPISODE,
    RECEIVE_EPISODE,
    REQUEST_CATEGORY,
    RECEIVE_CATEGORY,
    SUBSCRIBE_PODCAST,
    UNSUBSCRIBE_PODCAST,
    PLAY,
    PAUSE,
    ENDED,
    LISTEN_EPISODE,
    RECORD_TYPE_FULL,
} from 'store/shared';

const API_BASE = `https://api.spreaker.com/v2`;
const LIST_SIZE = 25;

function requestShow(podcast) {
    return {
        type: REQUEST_SHOW,
        id: podcast,
    };
}

function receiveShow(podcast, data) {
    return {
        type: RECEIVE_SHOW,
        id: podcast,
        data,
        receivedAt: Date.now(),
    };
}

function fetchShow(showId) {
    return async dispatch => {
        dispatch(requestShow(showId));

        // TODO: Add proper error handling
        const responses = await Promise.all([
            fetch(`${API_BASE}/shows/${showId}`),
            fetch(`${API_BASE}/shows/${showId}/episodes?limit=${LIST_SIZE}`),
        ]);

        const [showResponse, episodeResponse] = await Promise.all(responses.map(res => res.json()));

        dispatch(
            receiveShow(showId, {
                show: showResponse.response.show,
                episodes: episodeResponse.response.items,
            }),
        );
    };
}

function shouldFetchShow(state, showId) {
    return !state.podcasts[showId] || state.podcasts[showId].type !== RECORD_TYPE_FULL;
}

export function fetchShowIfNeeded(showId) {
    return (dispatch, getState) => {
        const state = getState();

        // TODO: Add proper cache invalidation and refetching
        if (shouldFetchShow(state, showId)) {
            dispatch(fetchShow(showId));
        }
    };
}

function requestEpisode(episodeId) {
    return {
        type: REQUEST_EPISODE,
        id: episodeId,
    };
}

function receiveEpisode(episodeId, data) {
    return {
        type: RECEIVE_EPISODE,
        id: episodeId,
        data,
        receivedAt: Date.now(),
    };
}

function fetchEpisode(episodeId) {
    return async dispatch => {
        dispatch(requestEpisode(episodeId));

        const response = await fetch(`${API_BASE}/episodes/${episodeId}`);
        const data = await response.json();

        dispatch(receiveEpisode(episodeId, data.response.episode));
    };
}

export function fetchEpisodeIfNeeded(episodeId) {
    return (dispatch, getState) => {
        const state = getState();

        // TODO: Add proper cache invalidation and refetching
        if (!state.episodes[episodeId] || state.episodes[episodeId].type !== RECORD_TYPE_FULL) {
            dispatch(fetchEpisode(episodeId));
        }
    };
}

function requestCategory(categoryId) {
    return {
        type: REQUEST_CATEGORY,
        categoryId,
    };
}

function receiveCategory(categoryId, data) {
    return {
        type: RECEIVE_CATEGORY,
        categoryId,
        data,
        receivedAt: Date.now(),
    };
}

function fetchCategory(categoryId) {
    return async dispatch => {
        dispatch(requestCategory(categoryId));

        // TODO: Add proper error handling
        const response = await fetch(`${API_BASE}/explore/categories/${categoryId}/items?limit=${LIST_SIZE}`);
        const data = await response.json();

        const shows = data.response.items;
        dispatch(receiveCategory(categoryId, shows));
    };
}

function shouldFetchCategory(state, categoryId) {
    // TODO: Add proper cache invalidation and refetching
    if (!state.topPodcastsByCategory[categoryId]) {
        return true;
    }
}

export function fetchCategoryIfNeeded(categoryId) {
    return (dispatch, getState) => {
        if (shouldFetchCategory(getState(), categoryId)) {
            dispatch(fetchCategory(categoryId));
        }
    };
}

export function fetchSubscribedPodcastsIfNeeded() {
    return (dispatch, getState) => {
        const state = getState();

        for (const id of state.subscriptions) {
            // TODO: Avoid copy/paste
            if (shouldFetchShow(getState(), id)) {
                dispatch(fetchShow(id));
            }
        }
    };
}

export function subscribe(podcast) {
    return { type: SUBSCRIBE_PODCAST, id: podcast };
}

export function unsubscribe(podcast) {
    return { type: UNSUBSCRIBE_PODCAST, id: podcast };
}

export function play() {
    return { type: PLAY };
}

export function pause() {
    return { type: PAUSE };
}

export function ended() {
    return { type: ENDED };
}

export function listenEpisode(episode) {
    return { type: LISTEN_EPISODE, id: episode };
}
