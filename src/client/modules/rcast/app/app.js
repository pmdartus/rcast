/* global process */

import { LightningElement, createElement } from 'lwc';
import Navigo from 'navigo';

import ViewPodcasts from 'rcast/viewPodcasts';
import ViewPodcast from 'rcast/viewPodcast';
import ViewDiscover from 'rcast/viewDiscover';
import PodcastList from 'rcast/podcastList';

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
                this.setPage('rcast-view-podcast', ViewPodcasts);
            },
            '/podcasts/:id': ({ id }) => {
                this.setPage('rcast-view-podcast', ViewPodcast, {
                    podcastId: parseInt(id, 10),
                });
            },
            '/discover': () => {
                this.setPage('rcast-view-discover', ViewDiscover);
            },
            '/categories/:id': ({ id }) => {
                this.setPage('rcast-podcast-list', PodcastList, {
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
        this.template.querySelector('rcast-menu').close();
    }

    handleOpenMenuEvent() {
        this.template.querySelector('rcast-menu').open();
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
