import { LightningElement } from 'lwc';

export default class Tabs extends LightningElement {
    tabs = [];
    buttons = [];
    activeTabName;

    _didRendered = false;

    handleNavigateEvent = event => {
        const { tab: tabName } = event.detail;
        this.select(tabName);
    };

    connectedCallback() {
        this.addEventListener('navigate', this.handleNavigateEvent);
    }

    disconnectedCallback() {
        this.removeEventListener('navigate', this.handleNavigateEvent);
    }

    renderedCallback() {
        if (!this._didRendered) {
            this._didRendered = true;

            // Register all the tabs
            this.tabs = [...this.querySelectorAll('rcast-tab')];
            this.buttons = [...this.querySelectorAll('rcast-tab-button')];

            // Select the first tab after the initial render
            if (this.tabs.length) {
                const firstTabName = this.tabs[0].tab;
                this.select(firstTabName);
            }
        }
    }

    select(tabName) {
        // Do nothing if the tab active tab has the same name
        if (this.activeTabName === tabName) {
            return;
        }

        for (const el of this.tabs) {
            el.active = el.tab === tabName;
        }

        for (const el of this.buttons) {
            el.active = el.tab === tabName;
        }

        this.activeTabName = tabName;
    }
}
