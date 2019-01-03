import { LightningElement, track, wire } from 'lwc';
import { connectStore, store, fetchSubscribedPodcastsIfNeeded } from 'store/store';

export default class ViewPodcasts extends LightningElement {
    @track loading = true;
    @track podcasts = [];

    @wire(connectStore, { store })
    stateChange({ podcasts, subscriptions }) {
        this.loading = subscriptions.some(id => podcasts[id] === undefined || podcasts[id].isFetching);

        if (!this.loading) {
            this.podcasts = subscriptions.map(id => podcasts[id].data);
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
