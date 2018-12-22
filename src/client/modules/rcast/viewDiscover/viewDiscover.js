import { LightningElement } from 'lwc';
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

    handleGenreClick(event) {
        const { categoryId } = event.currentTarget.dataset;
        console.log(categoryId);
    }
}