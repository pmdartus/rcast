import { LightningElement, api, track } from 'lwc';
import { subscriptions, getPodcast } from 'rcast/store';

export default class ViewPodcast extends LightningElement {
    @api podcastId;

    @track podcast = null;
    @track isSubscribed = false;

    async connectedCallback() {
        const { podcastId } = this;

        this.isSubscribed = subscriptions.list().includes(podcastId);
        this.podcast = await getPodcast({ id: podcastId });
    }

    renderedCallback() {
        const { podcast } = this;

        if (podcast) {
            this.template.querySelector('.description').innerHTML =
                podcast.description;
        }
    }

    handleSubscribeClick() {
        subscriptions.unsubscribe(this.podcastId);
        this.goBack();
    }
}
