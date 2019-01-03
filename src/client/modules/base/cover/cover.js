import { LightningElement, api } from 'lwc';

export default class Cover extends LightningElement {
    @api href;
    @api name;
    @api roundedCorners = false;

    get imgClassName() {
        return [this.roundedCorners && 'rounded-corners'].filter(Boolean).join(' ');
    }

    handleImageLoad(event) {
        const { target } = event;
        target.classList.add('loaded');
    }
}
