import { LightningElement, api } from 'lwc';

export default class Tab extends LightningElement {
    @api tab;
    
    _active = false;

    @api 
    get active() {
        return this._active;
    }
    set active(value) {
        this._active = value;
        this.computeHostAttributes();
    }

    connectedCallback() {
        this.computeHostAttributes();
    }

    computeHostAttributes() {
        const { tab, active } = this;

        this.setAttribute('role', 'tabpanel');

        if (active) {
            this.setAttribute('aria-hidden', 'true');
            this.classList.remove('tab-hidden');
        } else {
            this.removeAttribute('aria-hidden');
            this.classList.add('tab-hidden');
        }

        this.setAttribute('tab', tab);
    }
}