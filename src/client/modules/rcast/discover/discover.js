import { LightningElement } from 'lwc';
import { categories } from 'rcast/utils';

export default class Discovery extends LightningElement {
    categories = categories.map(category => {
        return {
            id: category.id,
            name: category.name,
            iconUrl: `/svg/categories/${category.iconName}.svg`
        };
    });
}