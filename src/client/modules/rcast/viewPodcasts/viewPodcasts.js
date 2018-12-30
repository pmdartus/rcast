import { LightningElement, track, wire } from 'lwc';
import { connectStore, store, getPodcast } from 'rcast/store';

export default class ViewPodcasts extends LightningElement {
    @track podcasts = [];

    @wire(connectStore, { store })
    stateChange({ subscriptions }) {
        Promise.all(
            subscriptions.map(id => getPodcast({ id })),
        ).then(podcasts => {
            this.podcasts = podcasts;
        });
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
                    path: `/podcasts/${podcastId}`
                },
                composed: true,
                bubbles: true,
            }),
        );
    }
}
