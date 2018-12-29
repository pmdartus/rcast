const LOCAL_STORAGE_KEY = 'subscriptions';

class Subscriptions {
    constructor(podcastIds) {
        this._subscriptions = new Set(podcastIds);
    }

    list() {
        return Array.from(this._subscriptions);
    }

    isSubscribed(podcastId) {
        return this._subscriptions.has(podcastId);
    }

    subscribe(podcastId) {
        if (!this.isSubscribed(podcastId)) {
            this._subscriptions.add(podcastId);
            this._onChange();
        }
    }

    unsubscribe(podcastId) {
        if (this.isSubscribed(podcastId)) {
            this._subscriptions.delete(podcastId);
            this._onChange();
        }
    }

    _onChange() {
        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(this.list()),
        );

        this.dispatchEvent(new CustomEvent('change'));
    }

    static load() {
        const subscriptions = localStorage.getItem(LOCAL_STORAGE_KEY);
        return new Subscriptions(
            subscriptions ? JSON.parse(subscriptions) : [],
        );
    }
}

export default Subscriptions;
