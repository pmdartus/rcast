import {
    CONNECTIVITY_STATUS_CHANGED,
    REQUEST_SHOW,
    RECEIVE_SHOW_SUCCESS,
    RECEIVE_SHOW_ERROR,
    REQUEST_EPISODE,
    RECEIVE_EPISODE_SUCCESS,
    RECEIVE_EPISODE_ERROR,
    REQUEST_CATEGORY,
    RECEIVE_CATEGORY_SUCCESS,
    RECEIVE_CATEGORY_ERROR,
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

export function application(
    state = {
        isOnline: navigator.onLine,
    },
    action,
) {
    switch (action.type) {
        case CONNECTIVITY_STATUS_CHANGED:
            return {
                ...state,
                isOnline: action.isOnline,
            };

        default:
            return state;
    }
}

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
        type: null,
        error: null,
    },
    action,
) {
    switch (action.type) {
        case REQUEST_SHOW:
            return { ...state, isFetching: true };

        case RECEIVE_SHOW_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                data: {
                    ...action.data.show,
                    episodes: action.data.episodes.map(episode => episode.episode_id),
                },
                type: RECORD_TYPE_FULL,
                error: null,
            };
        }

        case RECEIVE_SHOW_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.error,
            };

        case RECEIVE_EPISODE_SUCCESS:
        case RECEIVE_CATEGORY_SUCCESS: {
            if (state.type === RECORD_TYPE_FULL) {
                return state;
            }

            return {
                ...state,
                isFetching: false,
                data: action.data,
                type: RECORD_TYPE_HIGHLIGHT,
                error: null,
            };
        }

        default:
            return state;
    }
}

export function podcasts(state = {}, action) {
    switch (action.type) {
        case REQUEST_SHOW:
        case RECEIVE_SHOW_SUCCESS:
        case RECEIVE_SHOW_ERROR:
            return {
                ...state,
                [action.id]: podcast(state[action.id], action),
            };

        case RECEIVE_EPISODE_SUCCESS:
            return {
                ...state,
                [action.data.show_id]: podcast(state[action.data.show_id], {
                    ...action,
                    data: action.data.show,
                }),
            };

        case RECEIVE_CATEGORY_SUCCESS:
            return action.data.reduce(
                (acc, entry) => {
                    return {
                        ...acc,
                        [entry.show_id]: podcast(acc[entry.show_id], {
                            ...action,
                            data: entry,
                        }),
                    };
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
        data: null,
        error: null,
    },
    action,
) {
    switch (action.type) {
        case REQUEST_CATEGORY:
            return {
                ...state,
                isFetching: true,
            };

        case RECEIVE_CATEGORY_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.data.map(show => show.show_id),
                error: null,
            };

        case RECEIVE_CATEGORY_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.error,
            };

        default:
            return state;
    }
}

export function topShowsByCategory(state = {}, action) {
    switch (action.type) {
        case REQUEST_CATEGORY:
        case RECEIVE_CATEGORY_SUCCESS:
        case RECEIVE_CATEGORY_ERROR:
            return {
                ...state,
                [action.categoryId]: showsByCategory(state[action.categoryId], action),
            };

        default:
            return state;
    }
}

function episode(
    state = {
        isFetching: false,
        data: null,
        type: null,
        error: null,
    },
    action,
) {
    switch (action.type) {
        case REQUEST_EPISODE:
            return {
                ...state,
                isFetching: true,
            };

        case RECEIVE_EPISODE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.data,
                type: RECORD_TYPE_FULL,
                error: null,
            };

        case RECEIVE_EPISODE_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.error,
            };

        case RECEIVE_SHOW_SUCCESS: {
            if (state.type === RECORD_TYPE_FULL) {
                return state;
            }

            return {
                ...state,
                isFetching: false,
                data: action.data,
                type: RECORD_TYPE_HIGHLIGHT,
                error: null,
            };
        }

        default:
            return state;
    }
}

export function episodes(state = {}, action) {
    switch (action.type) {
        case REQUEST_EPISODE:
        case RECEIVE_EPISODE_SUCCESS:
        case RECEIVE_EPISODE_ERROR:
            return {
                ...state,
                [action.id]: episode(state[action.id], action),
            };

        case RECEIVE_SHOW_SUCCESS:
            return action.data.episodes.reduce(
                (acc, entry) => {
                    const episodeId = entry.episode_id;
                    return {
                        ...acc,
                        [episodeId]: episode(acc[episodeId], {
                            ...action,
                            data: entry,
                        }),
                    };
                },
                {
                    ...state,
                },
            );

        default:
            return state;
    }
}

function user(
    state = {
        isFetching: false,
        data: null,
        type: null,
        error: null,
    },
    action,
) {
    switch (action.type) {
        case RECEIVE_SHOW_SUCCESS:
        case RECEIVE_EPISODE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.data,
                type: RECORD_TYPE_HIGHLIGHT,
                error: null,
            };

        default:
            return state;
    }
}

export function users(state = {}, action) {
    switch (action.type) {
        case RECEIVE_SHOW_SUCCESS: {
            const { author } = action.data.show;
            return {
                ...state,
                [author.user_id]: user(state[author.user_id], {
                    ...action,
                    data: author,
                }),
            };
        }

        case RECEIVE_EPISODE_SUCCESS: {
            const { author } = action.data;
            return {
                ...state,
                [author.user_id]: user(state[author.user_id], {
                    ...action,
                    data: author,
                }),
            };
        }

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
