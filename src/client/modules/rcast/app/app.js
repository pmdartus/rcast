/* global process */

import { LightningElement, createElement } from 'lwc';
import Navigo from 'navigo';

import ViewPodcasts from 'view/podcasts';
import ViewPodcast from 'view/podcast';
import ViewDiscover from 'view/discover';
import PodcastList from 'view/category';

export default class App extends LightningElement {
    releaseVersion = process.env.RELEASE_VERSION;
    releaseDate = process.env.RELEASE_DATE;

    router = new Navigo(location.origin, false);

    menuItems = [{
        title: 'Podcast',
        location: '/podcasts',
        iconName: 'grid',
    }, {
        title: 'Discover',
        location: '/discover',
        iconName: 'search',
    }];

    constructor() {
        super();

        this.router.on({
            '/podcasts': () => {
                this.setPage('view-podcasts', ViewPodcasts);
            },
            '/podcasts/:id': ({ id }) => {
                this.setPage('view-podcast', ViewPodcast, {
                    podcastId: parseInt(id, 10),
                });
            },
            '/discover': () => {
                this.setPage('view-discover', ViewDiscover);
            },
            '/categories/:id': ({ id }) => {
                this.setPage('view-category', PodcastList, {
                    categoryId: parseInt(id, 10),
                });
            }
        });

        this.router.on(() => {
            this.setPage('view-podcast', ViewPodcasts);
        });
    }

    renderedCallback() {
        // Resolve the current view only after the container has rendered
        if (!this.isRendered) {
            this.isRendered = true;
            this.router.resolve();
        }
    }

    handleMenuItemClick(evt) {
        evt.preventDefault();

        const { href } = evt.target;

        this.router.navigate(href, true);
        this.template.querySelector('base-menu').close();
    }

    handleOpenMenuEvent() {
        this.template.querySelector('base-menu').open();
    }

    handleNavigateEvent(event) {
        const { path } = event.detail;
        this.router.navigate(path);
    }

    setPage(tagName, component, props = {}) {
        const el = createElement(tagName, {
            is: component,
            fallback: false,
        });

        Object.assign(el, props);

        // Remove previous components from the container if necessary
        const container = this.template.querySelector('.container');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        container.appendChild(el);
    }
}
