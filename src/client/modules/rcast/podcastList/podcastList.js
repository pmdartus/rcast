import { LightningElement, api, track } from 'lwc';

export default class PodcastList extends LightningElement {
    @api categoryId;

    @track isLoading = true;
    @track podcasts = [];

    connectedCallback() {
        if (!this.categoryId) {
            // eslint-disable-next-line no-console
            console.warn(`No genreId property has been set`);
            return;
        }

        // TODO: Add error handling
        fetch(`/api/1/top?genreId=${this.categoryId}`)
            .then(response => response.json())
            .then(res => {
                this.isLoading = false;
                this.podcasts = res.results;
            });
    }

    handlePodcastClick(event) {
        event.stopPropagation();
        const { podcastId } = event.currentTarget.dataset;

        this.dispatchEvent(
            new CustomEvent('podcastselected', {
                detail: { podcastId }
            })
        );
    }
}