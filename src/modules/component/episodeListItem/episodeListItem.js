import { LightningElement, api, track, wire } from 'lwc';

import { connectStore, store } from 'store/store';

import { convertMilliseconds, formatDate } from 'base/utils';

export default class EpisodeListItem extends LightningElement {
    @api episode;
    @track episodeInfo;

    @wire(connectStore, { store })
    storeChange({ info }) {
        const { episodeId } = this;
        this.episodeInfo = info.episodes[episodeId];
    }

    connectedCallback() {
        this.addEventListener('click', () => {
            this.dispatchEvent(
                new CustomEvent('navigate', {
                    detail: {
                        path: `/episodes/${this.episodeId}`,
                    },
                    composed: true,
                    bubbles: true,
                }),
            );
        });
    }

    get episodeId() {
        return this.episode.episode_id;
    }

    get releaseDate() {
        // Fix Safari bug not able to parse the date format.
        // TODO: Refactor all the usages.
        const publishedDate = new Date(this.episode.published_at.replace(' ', 'T'));
        return formatDate(publishedDate);
    }

    get duration() {
        const { minutes } = convertMilliseconds(this.episode.duration);
        return `${minutes}m`;
    }

    get isOffline() {
        return this.episodeInfo && this.episodeInfo.offline;
    }

    get isDownloading() {
        return this.episodeInfo && this.episodeInfo.downloading;
    }

    get downloadProgress() {
        const { episodeInfo } = this;

        const progress = episodeInfo && episodeInfo.downloadProgress ? episodeInfo.downloadProgress * 100 : 0;
        return `${Math.ceil(progress)}%`;
    }
}
