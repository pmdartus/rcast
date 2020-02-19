import { LightningElement, track, wire } from 'lwc';

import { connectStore, store } from 'store/store';
import { fetchSubscribedPodcastsIfNeeded } from 'store/actions';

export default class ViewPodcasts extends LightningElement {
    @track loading = true;

    @track podcasts = [];
    @track subscriptions = [];

    @wire(connectStore, { store })
    stateChange({ podcasts, info }) {
        this.subscriptions = info.subscriptions;

        this.loading = this.subscriptions.some(id => podcasts[id] === undefined || podcasts[id].isFetching);
        if (!this.loading) {
            this.podcasts = this.subscriptions.map(id => podcasts[id].data);
        }
    }

    connectedCallback() {
        store.dispatch(fetchSubscribedPodcastsIfNeeded());
    }

    handleMenuClick() {
        this.dispatchEvent(
            new CustomEvent('openmenu', {
                composed: true,
                bubbles: true,
            }),
        );
    }

    handlePodcastClick(event) {
        event.preventDefault();

        const { podcastId } = event.currentTarget.dataset;
        this.dispatchEvent(
            new CustomEvent('navigate', {
                detail: {
                    path: `/podcasts/${podcastId}`,
                },
                composed: true,
                bubbles: true,
            }),
        );
    }
}
