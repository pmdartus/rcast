import {
    SUBSCRIBE_SHOW,
    UNSUBSCRIBE_SHOW,
    DOWNLOAD_EPISODE_PROGRESS,
    DOWNLOAD_EPISODE_DONE,
    DOWNLOAD_EPISODE_ERROR,
    DISCARD_DOWNLOADED_EPISODE,
} from './constants';

function subscriptions(state = [], action) {
    switch (action.type) {
        case SUBSCRIBE_SHOW:
            return state.includes(action.id) ? state : [...state, action.id];

        case UNSUBSCRIBE_SHOW:
            return state.filter(id => id !== action.id);

        default:
            return state;
    }
}

function episode(state = { offline: false, downloading: false, downloadProgress: 0 }, action) {
    switch (action.type) {
        case DOWNLOAD_EPISODE_PROGRESS:
            return {
                ...state,
                offline: false,
                downloading: true,
                downloadProgress: action.progress,
            };

        case DOWNLOAD_EPISODE_DONE:
            return {
                ...state,
                offline: true,
                downloading: false,
                downloadProgress: 1,
            };

        case DOWNLOAD_EPISODE_ERROR:
        case DISCARD_DOWNLOADED_EPISODE:
            return {
                ...state,
                offline: false,
                downloading: false,
                downloadProgress: 0,
            };

        default:
            return state;
    }
}

export default function info(state = { subscriptions: [], episodes: {} }, action) {
    switch (action.type) {
        case SUBSCRIBE_SHOW:
        case UNSUBSCRIBE_SHOW:
            return {
                ...state,
                subscriptions: subscriptions(state.subscriptions, action),
            };

        case DOWNLOAD_EPISODE_PROGRESS:
        case DOWNLOAD_EPISODE_DONE:
        case DOWNLOAD_EPISODE_ERROR:
        case DISCARD_DOWNLOADED_EPISODE:
            return {
                ...state,
                episodes: {
                    ...state.episodes,
                    [action.id]: episode(state.episodes[action.id], action),
                },
            };

        default:
            return state;
    }
}
