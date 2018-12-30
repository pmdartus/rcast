/* global process */

import { LightningElement, createElement } from 'lwc';

import ViewPodcasts from 'rcast/viewPodcasts';
import ViewDiscover from 'rcast/viewDiscover';

export default class App extends LightningElement {
    releaseVersion = process.env.RELEASE_VERSION;
    releaseDate = process.env.RELEASE_DATE;

    pages = [{
        title: 'Podcast',
        name: 'podcast',
        location: '/podcasts',
        iconName: 'grid',
        tagName: 'view-podcast',
        component: ViewPodcasts,
    }, {
        title: 'Discover',
        name: 'discover',
        location: '/discover',
        iconName: 'search',
        tagName: 'view-discover',
        component: ViewDiscover,
    }];
    currentPage = null;

    connectedCallback() {
        window.onpopstate = () => {
            const { name: pageName } = window.history.state;
            const page = this.pages.find(p => p.name === pageName);

            this.setPage(page);
        }
    }

    renderedCallback() {
        if (!this.isRendered) {
            this.isRendered = true;
            this.setPage(this.pages[0]);
        }
    }

    handleMenuItemClick(evt) {
        evt.preventDefault();

        const { pageName } = evt.target.dataset;

        const page = this.pages.find(p => p.name === pageName);
        this.go(page);

        this.template.querySelector('rcast-menu').close();
    }

    handleOpenMenuEvent() {
        this.template.querySelector('rcast-menu').open();
    }

    go(page) {
        const { name, title, location } = page;
        this.setPage(page);

        history.pushState({ name }, title, location);
    }

    setPage(page) {
        const { tagName, component } = page;

        if (this.currentPage === page) {
            return;
        }

        const el = createElement(tagName, {
            is: component,
            fallback: false,
        });
        el.page = page;

        const container = this.template.querySelector('.container');
        
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        container.appendChild(el);

        this.currentPage = page;
    }
}
