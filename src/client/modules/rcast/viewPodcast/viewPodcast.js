import { LightningElement, api, track, wire } from 'lwc';
import {
    getPodcast,
    connectStore,
    store,
    subscribe,
    unsubscribe,
} from 'rcast/store';

export default class ViewPodcast extends LightningElement {
    @api podcastId;

    @track podcast = null;
    @track episodes = [];

    @track isSubscribed = false;

    @wire(connectStore, { store })
    storeChange({ subscriptions }) {
        this.isSubscribed = subscriptions.includes(this.podcastId);
    }

    async connectedCallback() {
        const podcast = await getPodcast({ id: this.podcastId });

        this.podcast = podcast;
        this.episodes = podcast.episodes;
    }

    get imageUrl() {
        return this.podcast && this.podcast.image;
    }

    get name() {
        return this.podcast && this.podcast.name;
    }

    get author() {
        return this.podcast && this.podcast.author.name;
    }

    get subscriptionLabel() {
        return this.isSubscribed ? 'unsubscribe' : 'subscribe';
    }

    renderedCallback() {
        if (this.podcast) {
            this.template.querySelector(
                '.description',
            ).innerHTML = this.podcast.description;
        }
    }

    handleSubscriptionClick() {
        const { isSubscribed, podcastId } = this;

        store.dispatch(
            isSubscribed ? unsubscribe(podcastId) : subscribe(podcastId),
        );

        if (isSubscribed) {
            window.history.back();
        }
    }
}
