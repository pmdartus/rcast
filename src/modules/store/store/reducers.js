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
    LISTEN_EPISODE,
    DOWNLOAD_EPISODE_PROGRESS,
    DOWNLOAD_EPISODE_DONE,
    DOWNLOAD_EPISODE_ERROR,
    DISCARD_DOWNLOADED_EPISODE,
    RECORD_TYPE_HIGHLIGHT,
    RECORD_TYPE_FULL,
    ENDED,
} from 'store/shared';

export function player(
    state = {
        episode: null,
        isPlaying: false,
    },
    action,
) {
    switch (action.type) {
        case PLAY:
            return {
                ...state,
                isPlaying: true,
            };

        case PAUSE:
            return {
                ...state,
                isPlaying: false,
            };

        case ENDED:
            return {
                ...state,
                isPlaying: false,
            };

        case LISTEN_EPISODE:
            return {
                episode: action.id,
                isPlaying: true,
            };

        default:
            return state;
    }
}

function podcast(
    state = {
        isFetching: false,
        data: null,
    },
    action,
) {
    switch (action.type) {
        case REQUEST_SHOW:
            return { ...state, isFetching: true };

        case RECEIVE_SHOW: {
            return {
                ...state,
                isFetching: false,
                lastUpdated: action.receivedAt,
                type: RECORD_TYPE_FULL,
                data: {
                    ...action.data.show,
                    episodes: action.data.episodes.map(episode => episode.episode_id),
                },
            };
        }

        default:
            return state;
    }
}

export function podcasts(state = {}, action) {
    switch (action.type) {
        case REQUEST_SHOW:
        case RECEIVE_SHOW:
            return {
                ...state,
                [action.id]: podcast(state[action.id], action),
            };

        case RECEIVE_EPISODE:
            return {
                ...state,
                [action.data.show_id]: {
                    isFetching: false,
                    type: RECORD_TYPE_HIGHLIGHT,
                    data: action.data.show,
                },
            };

        case RECEIVE_CATEGORY:
            return action.data.reduce(
                (acc, show) => {
                    if (!acc[show.show_id]) {
                        return {
                            ...acc,
                            [show.show_id]: {
                                isFetching: false,
                                type: RECORD_TYPE_HIGHLIGHT,
                                data: show,
                            },
                        };
                    }

                    return acc;
                },
                {
                    ...state,
                },
            );

        default:
            return state;
    }
}

function showsByCategory(
    state = {
        isFetching: false,
        lastUpdated: null,
        data: [],
    },
    action,
) {
    switch (action.type) {
        case REQUEST_CATEGORY:
            return {
                ...state,
                isFetching: true,
            };

        case RECEIVE_CATEGORY:
            return {
                isFetching: false,
                lastUpdated: action.receivedAt,
                data: action.data.map(show => show.show_id),
            };

        default:
            return state;
    }
}

export function topPodcastsByCategory(state = {}, action) {
    switch (action.type) {
        case REQUEST_CATEGORY:
        case RECEIVE_CATEGORY:
            return {
                ...state,
                [action.categoryId]: showsByCategory(state[action.categoryId], action),
            };

        default:
            return state;
    }
}

export function episodes(state = {}, action) {
    switch (action.type) {
        case RECEIVE_SHOW:
            return action.data.episodes.reduce(
                (acc, episode) => {
                    return {
                        ...acc,
                        [episode.episode_id]: {
                            isFetching: false,
                            lastUpdated: action.receivedAt,
                            type: RECORD_TYPE_HIGHLIGHT,
                            data: episode,
                        },
                    };
                },
                {
                    ...state,
                },
            );

        case REQUEST_EPISODE:
            return {
                ...state,
                [action.id]: {
                    isFetching: true,
                },
            };

        case RECEIVE_EPISODE:
            return {
                ...state,
                [action.id]: {
                    isFetching: false,
                    lastUpdated: action.receivedAt,
                    type: RECORD_TYPE_FULL,
                    data: action.data,
                },
            };

        default:
            return state;
    }
}

export function users(state = {}, action) {
    switch (action.type) {
        case RECEIVE_SHOW:
            return {
                ...state,
                [action.data.show.author_id]: {
                    isFetching: false,
                    lastUpdated: action.receivedAt,
                    type: RECORD_TYPE_HIGHLIGHT,
                    data: action.data.show.author,
                },
            };

        case RECEIVE_EPISODE:
            return {
                ...state,
                [action.data.author_id]: {
                    isFetching: false,
                    lastUpdated: action.receivedAt,
                    type: RECORD_TYPE_HIGHLIGHT,
                    data: action.data.author,
                },
            };

        default:
            return state;
    }
}

function subscriptions(state = [], action) {
    switch (action.type) {
        case SUBSCRIBE_PODCAST:
            return state.includes(action.id) ? state : [...state, action.id];

        case UNSUBSCRIBE_PODCAST:
            return state.filter(podcastId => podcastId !== action.id);

        default:
            return state;
    }
}

export function info(state = { subscriptions: [], episodes: {} }, action) {
    switch (action.type) {
        case SUBSCRIBE_PODCAST:
        case UNSUBSCRIBE_PODCAST:
            return {
                ...state,
                subscriptions: subscriptions(state.subscriptions, action),
            };

        case DOWNLOAD_EPISODE_PROGRESS:
            return {
                ...state,
                episodes: {
                    ...state.episodes,
                    [action.id]: {
                        offline: false,
                        downloading: true,
                        downloadProgress: action.progress,
                    },
                },
            };

        case DOWNLOAD_EPISODE_DONE:
            return {
                ...state,
                episodes: {
                    ...state.episodes,
                    [action.id]: {
                        offline: true,
                        downloading: false,
                        downloadProgress: 1,
                    },
                },
            };

        case DOWNLOAD_EPISODE_ERROR:
        case DISCARD_DOWNLOADED_EPISODE:
            return {
                ...state,
                episodes: {
                    ...state.episodes,
                    [action.id]: {
                        offline: false,
                        downloading: false,
                        downloadProgress: 0,
                    },
                },
            };

        default:
            return state;
    }
}
