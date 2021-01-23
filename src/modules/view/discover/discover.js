import { LightningElement, api, track, wire } from 'lwc';

import { connectStore, store } from 'rcast/store';

export const CATEGORY_ICON_MAPPING = {
    arts: 'brush',
    business: 'briefcase',
    comedy: 'smile',
    education: 'pen',
    'health-fitness': 'heart',
    leisure: 'gamepad',
    music: 'music',
    news: 'news',
    'religion-spirituality': 'cross',
    science: 'atom',
    'society-culture': 'chart',
    sports: 'soccer',
    technology: 'computer',
    'true-crime': 'badge',
    'tv-film': 'video',
};

export default class ViewDiscovery extends LightningElement {
    @api props;
    @track categories = [];

    @wire(connectStore, { store })
    storeChange({ categories }) {
        this.categories = Object.values(categories)
            .filter((category) => CATEGORY_ICON_MAPPING[category.permalink])
            .map((category) => ({
                ...category,
                icon_name: CATEGORY_ICON_MAPPING[category.permalink],
            }));
    }

    handleCategoryClick(event) {
        const { categoryId } = event.currentTarget.dataset;

        this.dispatchEvent(
            new CustomEvent('navigate', {
                bubbles: true,
                composed: true,
                detail: {
                    path: `categories/${categoryId}`,
                },
            }),
        );
    }
}
