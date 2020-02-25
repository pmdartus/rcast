import { CONNECTIVITY_STATUS_CHANGED } from './constants';

export default function application(
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
