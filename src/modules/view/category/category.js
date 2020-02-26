import { LightningElement, api, track, wire } from 'lwc';

import { connectStore, store } from 'rcast/store';
import { fetchCategoryIfNeeded } from 'rcast/store';

export default class PodcastList extends LightningElement {
    @api props;

    @track category;

    @wire(connectStore, { store })
    storeChange({ categories }) {
        this.category = categories[this.props.categoryId];
    }

    connectedCallback() {
        this.loadShows();
    }

    loadShows() {
        store.dispatch(fetchCategoryIfNeeded(this.props.categoryId));
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
