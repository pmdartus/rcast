import { LightningElement, api, track, wire } from 'lwc';

import { connectStore, store } from 'store/store';
import { downloadEpisode, discardDownloadedEpisode } from 'store/actions';

// Progress circle tutorial link:
// https://css-tricks.com/building-progress-ring-quickly/

// TODO: Remove radius hard-coding.
const DOWNLOAD_BUTTON_RADIUS = 10.5;
const DOWNLOAD_BUTTON_CIRCUMFERENCE = DOWNLOAD_BUTTON_RADIUS * 2 * Math.PI;

const BUTTON_STATE = {
    UNAVAILABLE: 'UNAVAILABLE',
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

        const isDeviceOnline = info.isOnline;
        const { downloading: downloadingEpisode, offline: offlineEpisode, downloadProgress } = info.episodes[
            episodeId
        ] || {
            offline: false,
            downloading: false,
            downloadProgress: 0,
        };

        if (downloadingEpisode) {
            this.state = BUTTON_STATE.DOWNLOADING;
            this.progress = downloadProgress;
        } else if (offlineEpisode) {
            this.state = BUTTON_STATE.CACHED;
            this.progress = 0;
        } else if (isDeviceOnline) {
            this.state = BUTTON_STATE.UNCACHED;
            this.progress = 0;
        } else {
            this.state = BUTTON_STATE.UNAVAILABLE;
            this.progress = 0;
        }
    }

    connectedCallback() {
        this.template.addEventListener('click', evt => {
            evt.stopPropagation();

            const { state, episodeId } = this;

            switch (state) {
                case BUTTON_STATE.UNAVAILABLE:
                    return window.dispatchEvent(
                        new CustomEvent('show-toast', {
                            detail: {
                                message: `This episode can't be downloaded right now.`,
                                duration: 3000, // 3 seconds
                            },
                        }),
                    );

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

    get progressContainerClass() {
        let stateClass;
        switch (this.state) {
            case BUTTON_STATE.UNAVAILABLE:
                stateClass = 'unavailable';
                break;

            case BUTTON_STATE.UNCACHED:
                stateClass = 'uncached';
                break;

            case BUTTON_STATE.CACHED:
                stateClass = 'cached';
                break;

            case BUTTON_STATE.DOWNLOADING:
                stateClass = 'downloading';
                break;
        }

        return `progress-container ${stateClass}`;
    }

    get progressRingStyle() {
        const { state, progress } = this;
        const offset =
            state === BUTTON_STATE.DOWNLOADING
                ? DOWNLOAD_BUTTON_CIRCUMFERENCE - progress * DOWNLOAD_BUTTON_CIRCUMFERENCE
                : 0;

        return [
            `stroke-dasharray: ${DOWNLOAD_BUTTON_CIRCUMFERENCE} ${DOWNLOAD_BUTTON_CIRCUMFERENCE}`,
            `stroke-dashoffset: ${offset}`,
        ].join('; ');
    }
}
