import { LightningElement, api } from 'lwc';

const VIEWS = [
    { viewName: 'podcast', label: 'Podcast', iconUrl: `/svg/app/tiles.svg` },
    { viewName: 'discover', label: 'Discover', iconUrl: `/svg/app/search.svg` },
];

export default class ActionBar extends LightningElement {
    @api viewName;

    get views() {
        return VIEWS.map(view => {
            return {
                ...view,
                className: view.viewName === this.viewName ? 'active' : '',
            };
        });
    }

    handleViewClick(event) {
        const { viewName } = event.target.dataset;

        // Discard event if the target view is the currently selected one
        if (viewName === this.viewName) {
            return;
        }

        this.dispatchEvent(
            new CustomEvent('navigate', {
                detail: {
                    viewName,
                },
            }),
        );
    }
}
