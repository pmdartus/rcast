import { LightningElement } from 'lwc';

import { categories } from 'rcast/utils';

export default class ViewDiscovery extends LightningElement {
    categories = categories;

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