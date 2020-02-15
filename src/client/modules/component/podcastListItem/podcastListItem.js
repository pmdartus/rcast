import { LightningElement, track, api, wire } from 'lwc';

import { connectStore, store } from 'store/store';
import { subscribe } from 'store/actions';

export default class PodcastListItem extends LightningElement {
    @api podcastId;

    @track podcast;
    @track isSubscribed;

    @wire(connectStore, { store })
    storeChange({ podcasts, subscriptions }) {
        const { podcastId } = this;

        this.podcast = podcasts[podcastId].data;
        this.isSubscribed = subscriptions.includes(podcastId);
    }

    get subscriptionIconName() {
        return this.isSubscribed ? 'check' : 'plus';
    }

    get subscriptionIconClassName() {
        return this.isSubscribed ? 'subscribed' : '';
    }

    handleSubscriptionIconClick(event) {
        event.stopPropagation();

        const { isSubscribed, podcast } = this;
        if (!isSubscribed) {
            store.dispatch(subscribe(podcast.show_id));
        }
    }
}
