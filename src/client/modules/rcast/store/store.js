import { register, ValueChangedEvent } from '@lwc/wire-service';

import Subscriptions from './subscriptions';

export function getPodcasts(...args) {
    console.log(args)
}

export const subscriptions = Subscriptions.load();
export { getPodcast, getTopPodcasts } from './api';

register(getPodcasts, eventTarget => {
    let config;

    eventTarget.dispatchEvent(
        new ValueChangedEvent({
            data: null,
            error: null,
        })
    );

    eventTarget.addEventListener('connect', () => {
        console.log('connected');
    });

    // TODO: This is never invoked, we need to understand why.
    eventTarget.addEventListener('disconnect', () => {
        // eslint-disable-next-line no-console
        console.log('disconnect');
    });

    eventTarget.addEventListener('config', (newConfig) => {
        config = newConfig;
    });
});