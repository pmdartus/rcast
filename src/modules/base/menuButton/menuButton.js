import { LightningElement } from 'lwc';

export default class MenuButton extends LightningElement {
    handleClick = () => {
        this.dispatchEvent(
            new CustomEvent('openmenu', {
                composed: true,
                bubbles: true,
            }),
        );
    };

    connectedCallback() {
        this.addEventListener('click', this.handleClick);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.handleClick);
    }
}
