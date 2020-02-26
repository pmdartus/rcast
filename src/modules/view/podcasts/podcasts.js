import { LightningElement, api, track, wire } from 'lwc';

import { connectStore, store } from 'rcast/store';
import { fetchSubscribedShowsIfNeeded } from 'rcast/store';

export default class ViewPodcasts extends LightningElement {
    @api props;

    @track loading = true;
    @track podcasts = [];
    @track subscriptions = [];

    @wire(connectStore, { store })
    stateChange({ shows, info }) {
        this.subscriptions = info.subscriptions;

        this.loading = this.subscriptions.some(id => shows[id] === undefined || shows[id].isFetching);
        if (!this.loading) {
            this.podcasts = this.subscriptions.map(id => shows[id].data);
        }
    }

    connectedCallback() {
        store.dispatch(fetchSubscribedShowsIfNeeded());
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
