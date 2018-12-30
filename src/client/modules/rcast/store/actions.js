export const SUBSCRIBE_PODCAST = 'SUBSCRIBE_PODCAST';
export const UNSUBSCRIBE_PODCAST = 'UNSUBSCRIBE_PODCAST';

export function subscribe(id) {
    return {
        type: SUBSCRIBE_PODCAST,
        id: id,
    };
}

export function unsubscribe(id) {
    return {
        type: UNSUBSCRIBE_PODCAST,
        id: id,
    };
}