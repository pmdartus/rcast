import { LightningElement, createElement } from 'lwc';

import PodcastList from 'rcast/podcastList';
import { categories } from 'rcast/utils';

export default class ViewDiscovery extends LightningElement {
    categories = categories;

    handleCategoryClick(event) {
        const categoryId = parseInt(event.currentTarget.dataset.categoryId, 10);
        
        const element = createElement('rcast-podcast-list', {
            is: PodcastList,
            fallback: false,
        });
        element.categoryId = categoryId;

        this.dispatchEvent(
            new CustomEvent('navstackpush', {
                bubbles: true,
                composed: true,
                detail: {
                    element,
                },
            }),
        );
    }
}