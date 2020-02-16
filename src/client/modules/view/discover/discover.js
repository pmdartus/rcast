import { LightningElement } from 'lwc';

import { categories, iconMapping } from 'base/utils';

export default class ViewDiscovery extends LightningElement {
    get categories() {
        return Object.keys(iconMapping).map(permalink => {
            const category = categories.find(c => c.permalink === permalink);

            return {
                ...category,
                icon_name: iconMapping[permalink],
            };
        });
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
