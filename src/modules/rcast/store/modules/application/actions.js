import { CONNECTIVITY_STATUS_CHANGED } from './constants';

export function connectivityStatusChanged() {
    return {
        type: CONNECTIVITY_STATUS_CHANGED,
        isOnline: navigator.onLine,
    };
}
