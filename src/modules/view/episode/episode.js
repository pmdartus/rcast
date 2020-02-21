import { LightningElement, api, track, wire } from 'lwc';

import { formatDate } from 'base/utils';
import { connectStore, store } from 'store/store';
import { fetchEpisodeIfNeeded, listenEpisode, downloadEpisode } from 'store/actions';

export default class Episode extends LightningElement {
    @api episodeId;

    @track show;
    @track episode;
    @track author;

    @wire(connectStore, { store })
    storeChange({ episodes, podcasts, users }) {
        this.episode = episodes[this.episodeId];

        if (this.episode && this.episode.data) {
            const episode = this.episode.data;

            this.show = podcasts[episode.show_id];
            this.author = users[episode.author_id];
        }
    }

    connectedCallback() {
        this.loadEpisode();
    }

    loadEpisode() {
        store.dispatch(fetchEpisodeIfNeeded(this.episodeId));
    }

    get releaseDate() {
        return this.episode.data ? formatDate(new Date(this.episode.data.published_at)) : '';
    }

    handleHeaderClick() {
        if (!this.episode.data) {
            return;
        }

        this.dispatchEvent(
            new CustomEvent('navigate', {
                detail: {
                    path: `/podcasts/${this.episode.data.show_id}`,
                },
                composed: true,
                bubbles: true,
            }),
        );
    }

    handlePlay() {
        store.dispatch(listenEpisode(this.episodeId));
    }

    handleDownload() {
        store.dispatch(downloadEpisode(this.episodeId));
    }
}
