import { LightningElement, track, api, wire } from 'lwc';
import { connectStore, store, subscribe } from 'rcast/store';

export default class PodcastListItem extends LightningElement {
    @api podcast;
    @track isSubscribed;

    @wire(connectStore, { store })
    storeChange({ subscriptions }) {
        this.isSubscribed = subscriptions.includes(this.podcast.id);
    }

    isSubscribed() {
        const { subscriptions, podcast } = this;
        return subscriptions.includes(podcast.id);
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
            store.dispatch(subscribe(podcast.id));
        }
    }
}
