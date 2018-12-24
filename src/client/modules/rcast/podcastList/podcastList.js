import { LightningElement, api, track } from 'lwc';

export default class PodcastList extends LightningElement {
    @api categoryId;

    @track state = {
        loading: false,
        result: null,
    };

    connectedCallback() {
        this.fetchPodcasts();
    }

    handleLoadRetry() {
        this.fetchPodcasts();
    }

    handlePodcastClick(event) {
        event.stopPropagation();
        const { podcastId } = event.currentTarget.dataset;

        this.dispatchEvent(
            new CustomEvent('podcastselected', {
                detail: { podcastId },
            }),
        );
    }

    async fetchPodcasts() {
        if (!this.categoryId) {
            // eslint-disable-next-line no-console
            throw new TypeError(`No categoryId property has been set`);
        }

        this.state = {
            loading: true,
            result: null,
        };

        try {
            const response = await fetch(
                `/api/1/top?genreId=${this.categoryId}`,
            );
            const res = await response.json();

            if (!response.ok) {
                this.state = {
                    loading: false,
                    result: {
                        error: res.error || 'Error',
                    },
                };
            } else {
                this.state = {
                    loading: false,
                    result: {
                        data: res.results,
                    },
                };
            }
        } catch (error) {
            this.state = {
                loading: false,
                result: {
                    error,
                },
            };
        }
    }
}
