import { LightningElement, api } from 'lwc';

const IS_SHARE_SUPPORTED = 'share' in navigator;

export default class ShareButton extends LightningElement {
    @api title;
    @api text;
    @api url;

    get iconClass() {
        return IS_SHARE_SUPPORTED ? '' : 'unsupported';
    }

    async handleClick() {
        const { title, text, url = window.location.href } = this;

        if (!IS_SHARE_SUPPORTED) {
            return;
        }

        if (!title || !text) {
            console.warn(`Can't share because either title or text properties are not set`);
            return;
        }

        try {
            await navigator.share({
                title,
                text,
                url,
            });
        } catch (error) {
            console.error('Something wrong happened when attempting to share', error);
        }
    }
}
