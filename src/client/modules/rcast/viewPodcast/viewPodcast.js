import { LightningElement, api, track } from 'lwc';

export default class ViewPodcast extends LightningElement {
    @api podcastId;
    @track podcast = null;

    connectedCallback() {
        fetch(`/api/1/podcasts/${this.podcastId}`)
            .then(response => response.json())
            .then(res => {
                this.podcast = res;
            });
    }

    renderedCallback() {
        const { podcast } = this;

        if (podcast) {
            this.template.querySelector('.description').innerHTML = podcast.description;
        }
    }
}
