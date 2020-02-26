import { RECORD_TYPE_FULL, RECORD_TYPE_HIGHLIGHT } from '../../constants';
import { RECEIVE_SHOW_SUCCESS } from '../shows/constants';
import { REQUEST_EPISODE, RECEIVE_EPISODE_SUCCESS, RECEIVE_EPISODE_ERROR } from './constants';

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

export default function episodes(state = {}, action) {
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
