import { LightningElement, api, track, wire } from 'lwc';

import { formatDate } from 'base/utils';
import { connectStore, store } from 'rcast/store';
import { fetchEpisodeIfNeeded, listenEpisode, downloadEpisode } from 'rcast/store';

export default class Episode extends LightningElement {
    @api props;

    @track show;
    @track episode;
    @track author;

    @wire(connectStore, { store })
    storeChange({ episodes, shows, users }) {
        this.episode = episodes[this.props.episodeId];

        if (this.episode && this.episode.data) {
            const episode = this.episode.data;

            this.show = shows[episode.show_id];
            this.author = users[episode.author_id];
        }
    }

    connectedCallback() {
        this.loadEpisode();
    }

    loadEpisode() {
        store.dispatch(fetchEpisodeIfNeeded(this.props.episodeId));
    }

    get releaseDate() {
        // Fix Safari bug not able to parse the date format.
        // TODO: Refactor all the usages.
        const publishedDate = new Date(this.episode.data.published_at.replace(' ', 'T'));
        return this.episode.data ? formatDate(publishedDate) : '';
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
        store.dispatch(listenEpisode(this.props.episodeId));
    }

    handleDownload() {
        store.dispatch(downloadEpisode(this.props.episodeId));
    }
}
