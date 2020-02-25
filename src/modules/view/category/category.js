import { LightningElement, api, track, wire } from 'lwc';

import { connectStore, store } from 'rcast/store';
import { fetchCategoryIfNeeded } from 'rcast/store';

export default class PodcastList extends LightningElement {
    @api categoryId;

    @track category;

    @wire(connectStore, { store })
    storeChange({ categories }) {
        this.category = categories[this.categoryId];
        console.log(this.category);
    }

    connectedCallback() {
        this.loadShows();
    }

    loadShows() {
        store.dispatch(fetchCategoryIfNeeded(this.categoryId));
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
