import { LightningElement, api, track, wire } from 'lwc';

import { categories } from 'base/utils';

import { connectStore, store } from 'rcast/store';
import { fetchCategoryIfNeeded } from 'rcast/store';

export default class PodcastList extends LightningElement {
    @api categoryId;

    @track shows;

    @wire(connectStore, { store })
    storeChange({ categories }) {
        this.shows = categories[this.categoryId];
    }

    connectedCallback() {
        this.loadShows();
    }

    loadShows() {
        store.dispatch(fetchCategoryIfNeeded(this.categoryId));
    }

    get categoryName() {
        return categories.find(category => {
            return category.category_id == this.categoryId;
        }).name;
    }

    handleShowClick(event) {
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
