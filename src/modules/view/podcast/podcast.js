import { LightningElement, api, track, wire } from 'lwc';

import { connectStore, store } from 'store/store';
import { fetchShowIfNeeded, subscribe, unsubscribe } from 'store/actions';

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
        store.dispatch(fetchShowIfNeeded(this.podcastId));
    }

    renderedCallback() {
        if (this.podcast && this.podcast.description) {
            const descriptionEl = this.template.querySelector('.description');
            descriptionEl.innerHTML = this.podcast.description;
        }
    }

    get imageUrl() {
        return this.podcast && this.podcast.image_url;
    }

    get name() {
        return this.podcast && this.podcast.title;
    }

    get author() {
        return this.podcast && this.podcast.author && this.podcast.author.fullname;
    }

    get subscriptionLabel() {
        return this.isSubscribed ? 'unsubscribe' : 'subscribe';
    }

    get descriptionClassName() {
        return `description ${this.isDescriptionExpanded && 'expanded'}`;
    }

    handleSubscriptionClick() {
        const { isSubscribed, podcastId } = this;

        if (isSubscribed) {
            if (window.confirm('Are you sure you want to unsubscribe?')) {
                store.dispatch(unsubscribe(podcastId));
                history.back();
            }
        } else {
            store.dispatch(subscribe(podcastId));
        }
    }

    handleDescriptionClick() {
        this.isDescriptionExpanded = true;
    }
}
