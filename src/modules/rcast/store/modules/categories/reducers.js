import { REQUEST_CATEGORY, RECEIVE_CATEGORY_SUCCESS, RECEIVE_CATEGORY_ERROR } from './constants';

function category(
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

export default function categories(state = {}, action) {
    switch (action.type) {
        case REQUEST_CATEGORY:
        case RECEIVE_CATEGORY_SUCCESS:
        case RECEIVE_CATEGORY_ERROR:
            return {
                ...state,
                [action.categoryId]: category(state[action.categoryId], action),
            };

        default:
            return state;
    }
}
