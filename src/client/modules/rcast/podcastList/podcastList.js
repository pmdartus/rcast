import { LightningElement, api, track } from 'lwc';

export default class PodcastList extends LightningElement {
    @api genreId;

    @track isLoading = true;
    @track podcasts = [];

    connectedCallback() {
        if (!this.genreId) {
            // eslint-disable-next-line no-console
            console.warn(`No genreId property has been set`);
            return;
        }

        fetch(`/api/1/top?genreId=${this.genreId}`)
            .then(response => response.json())
            .then(res => {
                this.podcasts = res.results;
            });
    }
}