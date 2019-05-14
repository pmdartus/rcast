/* global process */

import { LightningElement, createElement, track } from 'lwc';
import Navigo from 'navigo';

export default class App extends LightningElement {
    releaseVersion = process.env.RELEASE_VERSION;
    releaseDate = process.env.RELEASE_DATE;

    router = new Navigo(location.origin, false);

    menuItems = [
        {
            title: 'Podcast',
            location: '/podcasts',
            iconName: 'grid',
        },
        {
            title: 'Discover',
            location: '/discover',
            iconName: 'search',
        },
    ];

    @track playerExpanded = false;

    constructor() {
        super();

        this.router.on({
            '/podcasts': async () => {
                const {
                    default: ViewPodcasts,
                } = await import(/* webpackChunkName: "view-podcasts", webpackPreload: true */ 'view/podcasts');
                this.setPage('view-podcasts', ViewPodcasts);
            },
            '/podcasts/:id': async ({ id }) => {
                const {
                    default: ViewPodcast,
                } = await import(/* webpackChunkName: "view-podcast", webpackPreload: true */ 'view/podcast');
                this.setPage('view-podcast', ViewPodcast, {
                    podcastId: parseInt(id, 10),
                });
            },
            '/discover': async () => {
                const {
                    default: ViewDiscover,
                } = await import(/* webpackChunkName: "view-discover", webpackPreload: true */ 'view/discover');
                this.setPage('view-discover', ViewDiscover);
            },
            '/categories/:id': async ({ id }) => {
                const {
                    default: PodcastList,
                } = await import(/* webpackChunkName: "view-category", webpackPreload: true */ 'view/category');
                this.setPage('view-category', PodcastList, {
                    categoryId: parseInt(id, 10),
                });
            },
        });

        const navigateToDefault = () => {
            this.router.navigate('/podcasts');
        };

        this.router.notFound(navigateToDefault);
        this.router.on(navigateToDefault);
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

    handlePlayerCondensedClick() {
        this.template.querySelector('component-player').show();
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
