import { LightningElement, api, track } from 'lwc';

export default class PodcastListItem extends LightningElement {
    @api podcastId;
    @api podcast;

    @track subscribed = false;

    get subscribedIconName() {
        return this.subscribed ? 'check' : 'plus';
    }

    handleSubscribeIconClick(event) {
        event.stopPropagation();
        event.preventDefault();

        this.subscribed = !this.subscribed;
    }
}
