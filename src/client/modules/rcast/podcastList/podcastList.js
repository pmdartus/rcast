import { LightningElement, api, track, wire } from 'lwc';

import { getPodcasts } from 'rcast/store';
import { categories } from 'rcast/utils';

export default class PodcastList extends LightningElement {
    @api categoryId;

    @wire(getPodcasts, { cacategoryId: '$categoryId' })
    podcastList(...args) {
        console.log(args);
    }

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

    get categoryName() {
        return categories.find(category => {
            return category.id == this.categoryId;
        }).name;
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

    handlePodcastClick(event) {
        const { id: podcastId } = event.target.podcast;

        this.dispatchEvent(
            new CustomEvent('navigate', {
                bubbles: true,
                composed: true,
                detail: {
                    path: `podcasts/${podcastId}`,
                },
            }),
        );
    }
}
