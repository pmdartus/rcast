import {
    REQUEST_SHOW,
    RECEIVE_SHOW,
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

const API_BASE = `https://api.spreaker.com/v2/`;
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
        const response = await fetch(`${API_BASE}/shows/${showId}`);
        const data = await response.json();

        dispatch(receiveShow(showId, data));
    };
}

function shouldFetchShow(state, showId) {
    // TODO: Add proper cache invalidation and refetching
    if (!state.podcasts[showId] || state.podcasts[showId].type !== RECORD_TYPE_FULL) {
        return true;
    }
}

export function fetchShowIfNeeded(id) {
    return (dispatch, getState) => {
        if (shouldFetchShow(getState(), id)) {
            dispatch(fetchShow(id));
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
