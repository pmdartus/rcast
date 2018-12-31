import { LightningElement, api, track, wire } from 'lwc';
import {
    fetchPodcastIfNeeded,
    connectStore,
    store,
    subscribe,
    unsubscribe,
} from 'store/store';

export default class ViewPodcast extends LightningElement {
    @api podcastId;

    @track podcast = null;
    @track episodes = [];
    @track isSubscribed = false;

    @wire(connectStore, { store })
    storeChange({ podcasts, subscriptions, episodes }) {
        const { podcastId } = this;

        this.isSubscribed = subscriptions.includes(podcastId);

        this.podcast = podcasts[podcastId] && podcasts[podcastId].data;

        if (this.podcast && this.podcast.episodes) {
            this.episodes = this.podcast.episodes.map(id => episodes[id].data);
        }
    }

    connectedCallback() {
        store.dispatch(
            fetchPodcastIfNeeded(this.podcastId)
        );
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
