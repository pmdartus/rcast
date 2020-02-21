import { LightningElement, api } from 'lwc';

export default class LoadingError extends LightningElement {
    @api error;

    get isOfflineError() {
        return this.error.name === 'OfflineError';
    }

    handleRetry(evt) {
        evt.stopPropagation();
        this.dispatchEvent(new CustomEvent('retry'));
    }
}
