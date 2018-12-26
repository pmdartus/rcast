import { LightningElement, api, track, createElement } from 'lwc';

import ViewPodcast from 'rcast/viewPodcast';
import { categories } from 'rcast/utils';

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
        const podcastId = parseInt(event.currentTarget.dataset.podcastId, 10);

        const element = createElement('rcast-view-podcast', {
            is: ViewPodcast,
            fallback: false,
        });
        element.podcastId = podcastId;

        this.dispatchEvent(
            new CustomEvent('navstackpush', {
                bubbles: true,
                composed: true,
                detail: {
                    element,
                },
            }),
        );
    }

    handleBack() {
        this.dispatchEvent(
            new CustomEvent('navstackop', {
                bubbles: true,
                composed: true,
            }),
        );
    }
}
