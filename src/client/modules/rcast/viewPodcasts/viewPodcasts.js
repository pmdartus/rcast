import { LightningElement, track, createElement } from 'lwc';
import ViewPodcast from 'rcast/viewPodcast';

const PODCAST_IDS = [1150510297, 354668519];

export default class ViewPodcasts extends LightningElement {
    @track podcasts = [];

    connectedCallback() {
        Promise.all(
            PODCAST_IDS.map(id => {
                return fetch(`/api/1/podcasts/${id}`).then(res => res.json());
            }),
        ).then(podcasts => {
            this.podcasts = podcasts;
        });
    }

    handlePodcastClick(event) {
        const { podcastId } = event.currentTarget.dataset;

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
}
