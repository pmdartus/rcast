import {
    REQUEST_PODCAST,
    RECEIVE_PODCAST,
    REQUEST_TOP_PODCASTS,
    RECEIVE_TOP_PODCASTS,
    SUBSCRIBE_PODCAST,
    UNSUBSCRIBE_PODCAST,
    PLAY,
    PAUSE,
    LISTEN_EPISODE,
    RECORD_TYPE_HIGHLIGHT,
    RECORD_TYPE_FULL,
    ENDED,
} from './actions';

export function subscriptions(state = [], action) {
    switch (action.type) {
        case SUBSCRIBE_PODCAST:
            return [...state, action.id];

        case UNSUBSCRIBE_PODCAST:
            return state.filter(podcastId => podcastId !== action.id);

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
    },
    action,
) {
    switch (action.type) {
        case REQUEST_PODCAST:
            return { ...state, isFetching: true };

        case RECEIVE_PODCAST: {
            const data = {
                ...action.data,
                episodes: action.data.episodes.map(episode => episode.id),
            };

            return {
                ...state,
                isFetching: false,
                lastUpdated: action.receivedAt,
                type: RECORD_TYPE_FULL,
                data,
            };
        }

        default:
            return state;
    }
}

export function podcasts(state = {}, action) {
    switch (action.type) {
        case REQUEST_PODCAST:
        case RECEIVE_PODCAST:
            return {
                ...state,
                [action.id]: podcast(state[action.id], action),
            };

        case RECEIVE_TOP_PODCASTS:
            return action.data.results.reduce(
                (acc, podcast) => {
                    if (!acc[podcast.id]) {
                        return {
                            ...acc,
                            [podcast.id]: {
                                isFetching: false,
                                type: RECORD_TYPE_HIGHLIGHT,
                                data: podcast,
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

function topPodcastByCategory(
    state = {
        isFetching: false,
        lastUpdated: null,
        data: [],
    },
    action,
) {
    switch (action.type) {
        case REQUEST_TOP_PODCASTS:
            return {
                ...state,
                isFetching: true,
            };

        case RECEIVE_TOP_PODCASTS:
            return {
                isFetching: false,
                lastUpdated: action.receivedAt,
                data: action.data.results.map(podcast => podcast.id),
            };

        default:
            return state;
    }
}

export function topPodcastsByCategory(state = {}, action) {
    switch (action.type) {
        case REQUEST_TOP_PODCASTS:
        case RECEIVE_TOP_PODCASTS:
            return {
                ...state,
                [action.categoryId]: topPodcastByCategory(state[action.categoryId], action),
            };

        default:
            return state;
    }
}

export function episodes(state = {}, action) {
    switch (action.type) {
        case RECEIVE_PODCAST:
            return action.data.episodes.reduce(
                (acc, episode) => {
                    return {
                        ...acc,
                        [episode.id]: {
                            data: {
                                podcastId: action.id,
                                ...episode,
                            },
                        },
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
