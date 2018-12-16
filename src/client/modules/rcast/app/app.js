import { LightningElement, track } from 'lwc';

export default class App extends LightningElement {
    @track viewName;

    constructor() {
        super();

        this.navigate(location.pathname === '/' ? '/podcasts' : location.pathname, true);

        window.onpopstate = () => {
            this.navigate(location.pathname);
        }
    }

    navigate(pathname, replaceState = false) {
        let viewName;

        if (pathname === '/podcasts') {
            viewName = 'podcasts';
        } else if (pathname === '/discover') {
            viewName = 'discover';
        } else {
            throw new Error(`Unknown path: ${pathname}`);
        }

        this.viewName = viewName;
        replaceState ?
            history.replaceState({}, `rcast - ${viewName}`, `/${viewName}`) :
            history.pushState({}, `rcast - ${viewName}`, `/${viewName}`);
    }

    get isViewPodcastsActive() {
        return this.viewName === 'podcasts';
    }

    get isViewDiscoverActive() {
        return this.viewName === 'discover';
    }

    handleNavigate(event) {
        const { viewName } = event.detail;
        this.navigate(`/${viewName}`);
    } 
}