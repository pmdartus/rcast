import { LightningElement, createElement } from 'lwc';

import PodcastList from 'rcast/podcastList';
import { categories } from 'rcast/utils';

const CATEGORIES = categories.map(category => {
    return {
        id: category.id,
        name: category.name,
        iconUrl: `/public/svg/icons.svg#icon-${category.iconName}`
    };
}); 

export default class ViewDiscovery extends LightningElement {
    categories = CATEGORIES;

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