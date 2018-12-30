import { SUBSCRIBE_PODCAST, UNSUBSCRIBE_PODCAST } from './actions';

const DEFAULT_SUBSCRIPTIONS = [
    1446491245,
    214089682,
    990897842
];

export function subscriptions(state = DEFAULT_SUBSCRIPTIONS, action) {
    const { type, id } = action;

    switch (type) {
        case SUBSCRIBE_PODCAST:
            return [...state, id];

        case UNSUBSCRIBE_PODCAST:
            return state.filter(podcastId => podcastId !== id);
    
        default:
            return state;
    }
}