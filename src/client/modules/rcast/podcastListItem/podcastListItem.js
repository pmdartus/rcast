import { LightningElement, track, api } from 'lwc';

import { subscriptions } from 'rcast/store';

export default class PodcastListItem extends LightningElement {
    @api podcast;
    @track subscriptions = subscriptions.list();

    handleSubscriptionChange = () => {
        this.subscriptions = subscriptions.list();
    };

    connectedCallback() {
        // subscriptions.addEventListener('change', this.handleSubscriptionChange);
    }

    disconnectedCallback() {
        // subscriptions.removeEventListener(
        //     'change',
        //     this.handleSubscriptionChange,
        // );
    }

    isSubscribed() {
        const { subscriptions, podcast } = this;
        return subscriptions.includes(podcast.id);
    }

    get subscribedIconName() {
        return this.isSubscribed() ? 'check' : 'plus';
    }

    handleSubscribeIconClick(event) {
        event.stopPropagation();

        if (this.isSubscribed()) {
            subscriptions.unsubscribe(this.podcast.id);
        } else {
            subscriptions.subscribe(this.podcast.id);
        }
    }
}
