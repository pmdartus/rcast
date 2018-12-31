import { register, ValueChangedEvent } from '@lwc/wire-service';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import * as reducers from './reducers';

// TODO: Remove this in production
const loggerMiddleware = store => next => action => {
    console.group(action.type);
    console.info('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    console.groupEnd();
    return result;
};

export const store = createStore(
    combineReducers(reducers),
    applyMiddleware(thunk, loggerMiddleware),
);

export function connectStore(store) {
    return store.getState();
}

register(connectStore, eventTarget => {
    let store;
    let subscription;

    const notifyStateChange = () => {
        const state = store.getState();
        eventTarget.dispatchEvent(new ValueChangedEvent(state));
    };

    eventTarget.addEventListener('connect', () => {
        subscription = store.subscribe(notifyStateChange);
        notifyStateChange();
    });

    // TODO: This is never invoked, we need to understand why.
    eventTarget.addEventListener('disconnect', () => {
        if (subscription) {
            subscription();
        }
    });

    eventTarget.addEventListener('config', config => {
        store = config.store;
    });
});

export {
    listenEpisode,
    play,
    pause,
    subscribe,
    unsubscribe,
    fetchPodcastIfNeeded,
    fetchTopPodcastsIfNeeded,
    fetchSubscribedPodcastsIfNeeded,
} from './actions';
