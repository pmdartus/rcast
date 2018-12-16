import { LightningElement } from 'lwc';
import { categories } from 'rcast/utils';

export default class ViewDiscovery extends LightningElement {
    categories = categories.map(category => {
        return {
            id: category.id,
            name: category.name,
            iconUrl: `/public/svg/icons.svg#icon-${category.iconName}`
        };
    });
}