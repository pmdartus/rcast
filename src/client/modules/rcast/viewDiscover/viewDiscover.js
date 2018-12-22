import { LightningElement, track } from 'lwc';
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

    @track selectedCategory;
    @track selectedPodcast;

    handleGenreClick(event) {
        const { categoryId } = event.currentTarget.dataset;
        this.selectedCategory = categoryId;
    }

    handlePodcastSelected(event) {
        const { podcastId } = event.detail;
        this.selectedPodcast = podcastId;
    }
}