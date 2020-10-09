export class connectStore {
    dataCallback;
    store;
    subscription;

    constructor(dataCallback) {
        this.dataCallback = dataCallback;
    }

    connect() {
        const notifyStateChange = () => {
            const state = this.store.getState();
            this.dataCallback(state);
        };
        this.subscription = this.store.subscribe(notifyStateChange);
        notifyStateChange();
    }

    disconnect() {
        if (this.subscription) {
            this.subscription();
        }
    }

    update(config) {
        this.store = config.store;
    }
}
