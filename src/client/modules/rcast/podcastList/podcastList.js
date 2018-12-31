import { LightningElement, api, track, wire } from 'lwc';

import { categories } from 'rcast/utils';
import { connectStore, store, fetchTopPodcastsIfNeeded } from 'rcast/store';

export default class PodcastList extends LightningElement {
    @api categoryId;

    @track loading = true;
    @track podcasts = [];

    @wire(connectStore, { store })
    storeChange({ topPodcastsByCategory, podcasts }) {
        const topPodcasts = topPodcastsByCategory[this.categoryId];
        
        if (topPodcasts) {
            this.loading = topPodcasts.isFetching;
            this.podcasts = topPodcasts.data.map(id => podcasts[id].data);
        }
    }

    connectedCallback() {
        this.fetchTopPodcasts();
    }

    fetchTopPodcasts() {
        store.dispatch(
            fetchTopPodcastsIfNeeded(this.categoryId)
        );
    }

    get categoryName() {
        return categories.find(category => {
            return category.id == this.categoryId;
        }).name;
    }

    handlePodcastClick(event) {
        const { id: podcastId } = event.target.podcast;

        this.dispatchEvent(
            new CustomEvent('navigate', {
                bubbles: true,
                composed: true,
                detail: {
                    path: `podcasts/${podcastId}`,
                },
            }),
        );
    }
}
