import { RECORD_TYPE_FULL, RECORD_TYPE_HIGHLIGHT } from '../../constants';
import { RECEIVE_EPISODE_SUCCESS } from '../episodes/constants';
import { RECEIVE_CATEGORY_SUCCESS } from '../categories/constants';
import { REQUEST_SHOW, RECEIVE_SHOW_SUCCESS, RECEIVE_SHOW_ERROR } from './constants';

function show(
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
                    episodes: action.data.episodes.map((episode) => episode.episode_id),
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

export default function shows(state = {}, action) {
    switch (action.type) {
        case REQUEST_SHOW:
        case RECEIVE_SHOW_SUCCESS:
        case RECEIVE_SHOW_ERROR:
            return {
                ...state,
                [action.id]: show(state[action.id], action),
            };

        case RECEIVE_EPISODE_SUCCESS:
            return {
                ...state,
                [action.data.show_id]: show(state[action.data.show_id], {
                    ...action,
                    data: action.data.show,
                }),
            };

        case RECEIVE_CATEGORY_SUCCESS:
            return action.data.reduce(
                (acc, entry) => {
                    return {
                        ...acc,
                        [entry.show_id]: show(acc[entry.show_id], {
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
