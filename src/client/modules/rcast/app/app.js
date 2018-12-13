import { LightningElement, track } from 'lwc';

export default class App extends LightningElement {
    @track viewName = 'podcasts';

    get isViewPodcastsActive() {
        return this.viewName === 'podcasts';
    }

    get isViewDiscoverActive() {
        return this.viewName === 'discover';
    }

    handleNavigate(event) {
        const { viewName } = event.detail;
        this.viewName = viewName;
    } 
}