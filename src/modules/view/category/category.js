import { LightningElement, api, track, wire } from 'lwc';

import { categories } from 'base/utils';

import { connectStore, store } from 'store/store';
import { fetchCategoryIfNeeded } from 'store/actions';

export default class PodcastList extends LightningElement {
    @api categoryId;

    @track loading = true;
    @track podcasts = [];

    @wire(connectStore, { store })
    storeChange({ topPodcastsByCategory }) {
        const topPodcasts = topPodcastsByCategory[this.categoryId];

        if (topPodcasts) {
            this.loading = topPodcasts.isFetching;
            this.podcasts = topPodcasts.data;
        }
    }

    connectedCallback() {
        this.fetchTopPodcasts();
    }

    fetchTopPodcasts() {
        store.dispatch(fetchCategoryIfNeeded(this.categoryId));
    }

    get categoryName() {
        return categories.find(category => {
            return category.category_id == this.categoryId;
        }).name;
    }

    handlePodcastClick(event) {
        const { podcastId } = event.target;

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
