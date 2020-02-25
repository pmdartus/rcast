import { RECORD_TYPE_HIGHLIGHT } from '../../constants';
import { RECEIVE_SHOW_SUCCESS } from '../shows/constants';
import { RECEIVE_EPISODE_SUCCESS } from '../episodes/constants';

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

export default function users(state = {}, action) {
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
