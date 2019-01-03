import { LightningElement, api, track, wire } from 'lwc';
import { fetchPodcastIfNeeded, connectStore, store, subscribe, unsubscribe } from 'store/store';

export default class ViewPodcast extends LightningElement {
    @api podcastId;

    @track podcast = null;
    @track episodes = [];
    @track isSubscribed = false;
    @track isDescriptionExpanded = false;

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
        store.dispatch(fetchPodcastIfNeeded(this.podcastId));
    }

    renderedCallback() {
        if (this.podcast && this.podcast.description) {
            const descriptionEl = this.template.querySelector('.description');
            descriptionEl.innerHTML = this.podcast.description;
        }
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

    get descriptionClassName() {
        return `description ${this.isDescriptionExpanded && 'expanded'}`;
    }

    handleSubscriptionClick() {
        const { isSubscribed, podcastId } = this;

        store.dispatch(isSubscribed ? unsubscribe(podcastId) : subscribe(podcastId));
    }

    handleDescriptionClick() {
        this.isDescriptionExpanded = true;
    }
}
