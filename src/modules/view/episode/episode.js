import { LightningElement, api, track, wire } from 'lwc';

import { connectStore, store } from 'store/store';
import { fetchEpisodeIfNeeded } from 'store/actions';
import { formatDate } from 'base/utils';

export default class Episode extends LightningElement {
    @api episodeId;

    @track loading = true;

    @track show;
    @track episode;
    @track author;

    @wire(connectStore, { store })
    storeChange({ episodes, podcasts, users }) {
        if (!episodes[this.episodeId] || episodes[this.episodeId].isFetching) {
            return;
        }

        const episode = episodes[this.episodeId].data;

        this.episode = episode;
        this.show = podcasts[episode.show_id].data;
        this.author = users[episode.author_id].data;

        this.loading = false;
    }

    connectedCallback() {
        store.dispatch(fetchEpisodeIfNeeded(this.episodeId));
    }

    get releaseDate() {
        return formatDate(new Date(this.episode.published_at));
    }

    handleHeaderClick() {
        this.dispatchEvent(
            new CustomEvent('navigate', {
                detail: {
                    path: `/podcasts/${this.show.show_id}`,
                },
                composed: true,
                bubbles: true,
            }),
        );
    }

    handlePlay() {
        console.log('Play');
    }

    handleDownload() {
        console.log('Download');
    }

    handleShare() {
        console.log('Share');
    }
}
