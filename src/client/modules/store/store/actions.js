export const REQUEST_PODCAST = 'REQUEST_PODCAST';
export const RECEIVE_EPISODES = 'RECEIVE_EPISODES';
export const RECEIVE_PODCAST = 'RECEIVE_PODCAST';

export const REQUEST_TOP_PODCASTS = 'REQUEST_TOP_PODCASTS';
export const RECEIVE_TOP_PODCASTS = 'RECEIVE_TOP_PODCASTS';

export const SUBSCRIBE_PODCAST = 'SUBSCRIBE_PODCAST';
export const UNSUBSCRIBE_PODCAST = 'UNSUBSCRIBE_PODCAST';

export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';
export const ENDED = 'ENDED';
export const LISTEN_EPISODE = 'LISTEN_EPISODE';

export const RECORD_TYPE_HIGHLIGHT = 'HIGHLIGHT';
export const RECORD_TYPE_FULL = 'FULL';

function requestPodcast(podcast) {
    return {
        type: REQUEST_PODCAST,
        id: podcast,
    };
}

function receivePodcast(podcast, data) {
    return {
        type: RECEIVE_PODCAST,
        id: podcast,
        data,
        receivedAt: Date.now(),
    };
}

function fetchPodcast(podcast) {
    return async dispatch => {
        dispatch(requestPodcast(podcast));

        // TODO: Add proper error handling
        const response = await fetch(`/api/1/podcasts/${podcast}`);
        const data = await response.json();

        dispatch(receivePodcast(podcast, data));
    };
}

function shouldFetchPodcast(state, podcast) {
    // TODO: Add proper cache invalidation and refetching
    if (!state.podcasts[podcast] || state.podcasts[podcast].type !== RECORD_TYPE_FULL) {
        return true;
    }
}

export function fetchPodcastIfNeeded(id) {
    return (dispatch, getState) => {
        if (shouldFetchPodcast(getState(), id)) {
            dispatch(fetchPodcast(id));
        }
    };
}

function requestTopPodcasts(categoryId) {
    return {
        type: REQUEST_TOP_PODCASTS,
        categoryId,
    };
}

function receiveTopPodcasts(categoryId, data) {
    return {
        type: RECEIVE_TOP_PODCASTS,
        categoryId,
        data,
        receivedAt: Date.now(),
    };
}

function fetchTopPodcasts(categoryId) {
    return async dispatch => {
        dispatch(requestTopPodcasts(categoryId));

        // TODO: Add proper error handling
        const response = await fetch(`/api/1/top?genreId=${categoryId}`);
        const data = await response.json();

        dispatch(receiveTopPodcasts(categoryId, data));
    };
}

function shouldFetchTopPodcasts(state, categoryId) {
    // TODO: Add proper cache invalidation and refetching
    if (!state.topPodcastsByCategory[categoryId]) {
        return true;
    }
}

export function fetchTopPodcastsIfNeeded(categoryId) {
    return (dispatch, getState) => {
        if (shouldFetchTopPodcasts(getState(), categoryId)) {
            dispatch(fetchTopPodcasts(categoryId));
        }
    };
}

export function fetchSubscribedPodcastsIfNeeded() {
    return (dispatch, getState) => {
        const state = getState();

        for (const id of state.subscriptions) {
            // TODO: Avoid copy/paste
            if (shouldFetchPodcast(getState(), id)) {
                dispatch(fetchPodcast(id));
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
