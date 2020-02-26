import { SUBSCRIBE_SHOW, UNSUBSCRIBE_SHOW } from './constants';

export function subscribe(showId) {
    return { type: SUBSCRIBE_SHOW, id: showId };
}

export function unsubscribe(showId) {
    return { type: UNSUBSCRIBE_SHOW, id: showId };
}
