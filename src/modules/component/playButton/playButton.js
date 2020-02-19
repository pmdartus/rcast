import { LightningElement, api, track, wire } from 'lwc';

import { connectStore, store } from 'store/store';
import { listenEpisode, pause } from 'store/actions';

import { convertMilliseconds } from 'base/utils';

const PLAY_BUTTON_RADIUS = 10.5;
const PLAY_BUTTON_CIRCUMFERENCE = PLAY_BUTTON_RADIUS * 2 * Math.PI;

export default class PlayButton extends LightningElement {
    @api episodeId;
    @api extended = false;

    @track isPlaying = false;
    @track message = '';

    @wire(connectStore, { store })
    storeChange({ player, episodes }) {
        const { episodeId } = this;
        const isPlaying = player.isPlaying && episodeId === player.episode;

        this.isPlaying = isPlaying;
        this.message = isPlaying ? 'Pause' : 'Play';

        if (!isPlaying && episodes[episodeId] && !episodes[episodeId].isFetching) {
            const episode = episodes[episodeId].data;
            this.message += ` • ${convertMilliseconds(episode.duration).minutes} min`;
        }
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

    get pillContainerClass() {
        return this.extended ? 'extended' : '';
    }

    get pillMessage() {
        return this.extended ? this.message : '';
    }
}
