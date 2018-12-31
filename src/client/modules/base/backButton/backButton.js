import { LightningElement } from 'lwc';

export default class MenuButton extends LightningElement {
    handleClick = () => {
        window.history.back();
    }

    connectedCallback() {
        this.addEventListener('click', this.handleClick);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.handleClick);
    }
}