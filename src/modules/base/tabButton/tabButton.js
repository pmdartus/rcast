import { LightningElement, api } from 'lwc';

export default class TabButton extends LightningElement {
    @api tab;

    _active = false;

    @api
    set active(val) {
        this._active = val;
        this.computeHostAttributes();
    }
    get active() {
        return this._active;
    }

    clickHandler = event => {
        event.stopPropagation();

        const { tab } = this;
        this.dispatchEvent(
            new CustomEvent('navigate', {
                bubbles: true,
                detail: {
                    tab: tab,
                },
            }),
        );
    };

    connectedCallback() {
        this.addEventListener('click', this.clickHandler);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.clickHandler);
    }

    computeHostAttributes() {
        const { tab, active } = this;

        this.setAttribute('role', 'tab');

        if (active) {
            this.setAttribute('aria-selected', 'true');
            this.classList.add('tab-selected');
        } else {
            this.setAttribute('aria-selected', 'false');
            this.classList.remove('tab-selected');
        }

        this.setAttribute('tab', tab);
    }
}
