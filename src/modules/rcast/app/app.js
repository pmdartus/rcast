import Navigo from 'navigo';
import { LightningElement, track } from 'lwc';

export default class App extends LightningElement {
    router = new Navigo(location.origin, false);
    routeStack = [];

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
        {
            title: 'Settings',
            location: '/settings',
            iconName: 'settings',
        },
    ];

    @track view;
    @track playerExpanded = false;

    constructor() {
        super();

        this.router.on({
            '/podcasts': async () => {
                const { default: ViewPodcasts } = await import('view/podcasts');
                this.setView(ViewPodcasts);
            },
            '/podcasts/:id': async ({ id }) => {
                const { default: ViewPodcast } = await import('view/podcast');
                this.setView(ViewPodcast, {
                    podcastId: parseInt(id, 10),
                });
            },
            '/discover': async () => {
                const { default: ViewDiscover } = await import('view/discover');
                this.setView(ViewDiscover);
            },
            '/categories/:id': async ({ id }) => {
                const { default: ViewCategory } = await import('view/category');
                this.setView(ViewCategory, {
                    categoryId: parseInt(id, 10),
                });
            },
            '/episodes/:id': async ({ id }) => {
                const { default: ViewEpisode } = await import('view/episode');
                this.setView(ViewEpisode, {
                    episodeId: parseInt(id, 10),
                });
            },
            '/settings': async () => {
                const { default: ViewSettings } = await import('view/settings');
                this.setView(ViewSettings);
            },
        });

        const navigateToDefault = () => {
            this.router.navigate('/podcasts');
        };

        this.router.notFound(navigateToDefault);
        this.router.on(navigateToDefault);

        this.router.resolve();
    }

    setView(component, props = {}) {
        this.view = {
            component,
            props,
        };
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
}
