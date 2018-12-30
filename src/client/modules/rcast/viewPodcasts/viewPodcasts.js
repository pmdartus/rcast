import { LightningElement, track, createElement } from 'lwc';

import ViewPodcast from 'rcast/viewPodcast';
import { subscriptions, getPodcast } from 'rcast/store';

export default class ViewPodcasts extends LightningElement {
    @track podcasts = [];

    handleSubscriptionChange = () => {
        this.loadPodcasts();
    };

    connectedCallback() {
        this.loadPodcasts();
        // subscriptions.addEventListener('change', this.handleSubscriptionChange);
    }

    disconnectedCallback() {
        // subscriptions.removeEventListener(
        //     'change',
        //     this.handleSubscriptionChange,
        // );
    }

    async loadPodcasts() {
        const podcastIds = subscriptions.list();

        this.podcasts = await Promise.all(
            podcastIds.map(id => getPodcast({ id })),
        );
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
