import { LightningElement, api } from 'lwc';

export default class Menu extends LightningElement {
    _visible;

    @api 
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this.setVisibility(value);
    }

    setVisibility(value) {
        this._visible = value;
        value ?
            this.classList.add('visible') :
            this.classList.remove('visible');
    }

    @api open() {
        this.setVisibility(true);
    }

    @api close() {
        this.setVisibility(false);
    }

    @api toggle() {
        this.setVisibility(!this._visible);
    }

    handleBackdropClick() {
        this.setVisibility(false);
    }
}