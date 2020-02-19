import { LightningElement, api, track, wire } from 'lwc';

import { connectStore, store } from 'store/store';
import { downloadEpisode, discardDownloadedEpisode } from 'store/actions';

// Progress circle tutorial link:
// https://css-tricks.com/building-progress-ring-quickly/

// TODO: Remove radius hard-coding.
const DOWNLOAD_BUTTON_RADIUS = 12;
const DOWNLOAD_BUTTON_CIRCUMFERENCE = DOWNLOAD_BUTTON_RADIUS * 2 * Math.PI;

const BUTTON_STATE = {
    UNCACHED: 'UNCACHED',
    CACHED: 'CACHED',
    DOWNLOADING: 'DOWNLOADING',
};

export default class DownloadButton extends LightningElement {
    @api episodeId;

    @track state = BUTTON_STATE.UNCACHED;
    @track progress = 0;

    @wire(connectStore, { store })
    storeChange({ info }) {
        const { episodeId } = this;

        if (!info.episodes[episodeId]) {
            this.state = BUTTON_STATE.UNCACHED;
            this.progress = 0;
        } else if (info.episodes[episodeId].offline) {
            this.state = BUTTON_STATE.CACHED;
            this.progress = 0;
        } else if (info.episodes[episodeId].downloading) {
            this.state = BUTTON_STATE.DOWNLOADING;
            this.progress = info.episodes[episodeId].downloadProgress;
        } else {
            // Handle all the other cases by showing the download button in the UNCACHED state.
            this.state = BUTTON_STATE.UNCACHED;
            this.progress = 0;
        }
    }

    connectedCallback() {
        this.template.addEventListener('click', () => {
            const { state, episodeId } = this;

            switch (state) {
                case BUTTON_STATE.UNCACHED:
                    return store.dispatch(downloadEpisode(episodeId));

                case BUTTON_STATE.CACHED:
                    return store.dispatch(discardDownloadedEpisode(episodeId));

                default:
                    // In the default case, do nothing for now.
                    break;
            }
        });
    }

    get isUncached() {
        return this.state === BUTTON_STATE.UNCACHED;
    }

    get isDownloading() {
        return this.state === BUTTON_STATE.DOWNLOADING;
    }

    get isCached() {
        return this.state === BUTTON_STATE.CACHED;
    }

    get downloadRingStyle() {
        const offset = DOWNLOAD_BUTTON_CIRCUMFERENCE - this.progress * DOWNLOAD_BUTTON_CIRCUMFERENCE;
        return [
            `stroke-dasharray: ${DOWNLOAD_BUTTON_CIRCUMFERENCE} ${DOWNLOAD_BUTTON_CIRCUMFERENCE}`,
            `stroke-dashoffset: ${offset}`,
        ].join('; ');
    }
}
