import { LightningElement, api } from 'lwc';

export default class Toast extends LightningElement {
    @api message = '';
    @api duration = 0;
    @api buttons = [];

    connectedCallback() {
        const { duration } = this;

        if (duration) {
            setTimeout(() => this.dismiss(), duration);
        }

        setTimeout(() => {
            this.classList.add('visible');
        });
    }

    @api dismiss() {
        this.classList.remove('visible');

        this.addEventListener('transitionend', () => {
            this.template.host.remove();
        });
    }

    handleButtonClick(evt) {
        const { text } = evt.target.dataset;

        const button = this.buttons.find((button) => button.text === text);
        button.callback(this.template.host);
    }
}
