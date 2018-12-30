import { LightningElement, api, track } from 'lwc';
import { subscriptions, getPodcast } from 'rcast/store';

export default class ViewPodcast extends LightningElement {
    @api podcastId;

    @track podcast = null;
    @track episodes = [];

    @track isSubscribed = false;

    async connectedCallback() {
        const { podcastId } = this;

        this.isSubscribed = subscriptions.list().includes(podcastId);

        const podcast = await getPodcast({ id: podcastId });
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

    renderedCallback() {
        const { podcast } = this;

        if (podcast) {
            this.template.querySelector('.description').innerHTML =
                podcast.description;
        }
    }

    handleSubscribeClick() {
    }
}
