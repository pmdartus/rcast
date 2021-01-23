import { LightningElement, api, track, wire } from 'lwc';

import { connectStore, store } from 'rcast/store';
import { fetchShowIfNeeded, subscribe, unsubscribe } from 'rcast/store';

export default class ViewPodcast extends LightningElement {
    @api props;

    @track podcast = null;
    @track author = null;
    @track episodes = [];
    @track isSubscribed = false;
    @track isDescriptionExpanded = false;

    @wire(connectStore, { store })
    storeChange({ shows, episodes, users, info }) {
        const { podcastId } = this.props;

        this.podcast = shows[podcastId];
        this.isSubscribed = info.subscriptions.includes(podcastId);

        if (this.podcast && this.podcast.data) {
            const { data: podcast } = this.podcast;

            this.author = users[podcast.author_id];
            this.episodes = podcast.episodes ? podcast.episodes.map((id) => episodes[id]) : [];
        }
    }

    connectedCallback() {
        this.loadShow();
    }

    loadShow() {
        store.dispatch(fetchShowIfNeeded(this.props.podcastId));
    }

    get title() {
        return this.podcast && this.podcast.data ? this.podcast.data.title : '';
    }

    get authorName() {
        return this.author && this.author.data ? this.author.fullname : '';
    }

    get descriptionClassName() {
        return `description ${this.isDescriptionExpanded ? 'expanded' : ''}`;
    }

    handleSubscriptionClick() {
        const {
            props: { podcastId },
            isSubscribed,
        } = this;

        if (isSubscribed) {
            if (window.confirm('Are you sure you want to unsubscribe?')) {
                store.dispatch(unsubscribe(podcastId));
            }
        } else {
            store.dispatch(subscribe(podcastId));
        }
    }

    handleDescriptionClick() {
        this.isDescriptionExpanded = true;
    }
}
