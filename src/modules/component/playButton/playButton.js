import { LightningElement, api, track, wire } from 'lwc';

import { connectStore, store } from 'store/store';
import { listenEpisode, pause } from 'store/actions';

const PLAY_BUTTON_RADIUS = 10.5;
const PLAY_BUTTON_CIRCUMFERENCE = PLAY_BUTTON_RADIUS * 2 * Math.PI;

export default class PlayButton extends LightningElement {
    @api episodeId;

    @track isPlaying = false;

    @wire(connectStore, { store })
    storeChange({ player }) {
        this.isPlaying = player.isPlaying && this.episodeId === player.episode;
    }

    connectedCallback() {
        this.addEventListener('click', evt => {
            evt.stopPropagation();

            if (this.isPlaying) {
                store.dispatch(pause());
            } else {
                store.dispatch(listenEpisode(this.episodeId));
            }
        });
    }

    get iconName() {
        return this.isPlaying ? 'pause' : 'play';
    }

    get progressRingStyle() {
        return [
            `stroke-dasharray: ${PLAY_BUTTON_CIRCUMFERENCE} ${PLAY_BUTTON_CIRCUMFERENCE}`,
            `stroke-dashoffset: 0`,
        ].join('; ');
    }
}
