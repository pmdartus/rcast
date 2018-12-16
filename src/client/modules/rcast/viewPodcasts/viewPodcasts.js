import { LightningElement, track } from 'lwc';

const PODCAST_IDS = [
    1150510297,
    354668519,
    // // TODO - investigate why not working: 1253186678,
    // 496893300,
    // 1066446588,
    // 1237401284,
    // 1232093829,
    // 396032722,
    // 803206041,
    // 401615933
];

export default class ViewPodcasts extends LightningElement {
    @track podcasts = [];
    @track selectedPodcastId = null;

    connectedCallback() {
        Promise.all(
            PODCAST_IDS.map(id => {
                return fetch(`/api/1/podcasts/${id}`)
                    .then(res => res.json())
            })
        ).then(podcasts => {
            this.podcasts = podcasts;
        })
    }

    handlePodcastClick(event) {
        const { podcastId } = event.currentTarget.dataset;
        this.selectedPodcastId = podcastId;
    }
}
