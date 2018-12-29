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

    handlePodcastClick(event) {
        const podcastId = parseInt(event.currentTarget.dataset.podcastId, 10);

        const element = createElement('rcast-view-podcast', {
            is: ViewPodcast,
            fallback: false,
        });
        element.podcastId = podcastId;

        this.dispatchEvent(
            new CustomEvent('navstackpush', {
                bubbles: true,
                composed: true,
                detail: {
                    element,
                },
            }),
        );
    }
}
