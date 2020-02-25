import { CATEGORIES, REQUEST_CATEGORY, RECEIVE_CATEGORY_SUCCESS, RECEIVE_CATEGORY_ERROR } from './constants';

const INITIAL_CATEGORIES = Object.fromEntries(
    CATEGORIES.map(category => {
        return [category.category_id, category];
    }),
);

function episodes(
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

export default function categories(state = INITIAL_CATEGORIES, action) {
    switch (action.type) {
        case REQUEST_CATEGORY:
        case RECEIVE_CATEGORY_SUCCESS:
        case RECEIVE_CATEGORY_ERROR: {
            const category = state[action.categoryId];
            return {
                ...state,
                [action.categoryId]: {
                    ...category,
                    episodes: episodes(category.episodes, action),
                },
            };
        }

        default:
            return state;
    }
}
