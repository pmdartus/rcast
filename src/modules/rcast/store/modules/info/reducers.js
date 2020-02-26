import { SUBSCRIBE_SHOW, UNSUBSCRIBE_SHOW } from './constants';

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

export default function info(state = { subscriptions: [], episodes: {} }, action) {
    switch (action.type) {
        case SUBSCRIBE_SHOW:
        case UNSUBSCRIBE_SHOW:
            return {
                ...state,
                subscriptions: subscriptions(state.subscriptions, action),
            };

        default:
            return state;
    }
}
