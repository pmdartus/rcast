import { LightningElement, api, track, wire } from 'lwc';

import { connectStore, store } from 'store/store';
import { listenEpisode, pause } from 'store/actions';

import { convertMilliseconds } from 'base/utils';

const PLAY_BUTTON_RADIUS = 10.5;
const PLAY_BUTTON_CIRCUMFERENCE = PLAY_BUTTON_RADIUS * 2 * Math.PI;

export default class PlayButton extends LightningElement {
    @api episodeId;
    @api extended = false;

    @track info;
    @track player;
    @track episode;

    @wire(connectStore, { store })
    storeChange({ player, episodes, info }) {
        this.info = info;
        this.player = player;
        this.episode = episodes[this.episodeId];
    }

    connectedCallback() {
        this.addEventListener('click', evt => {
            evt.stopPropagation();

            if (!this.canPlay) {
                window.dispatchEvent(
                    new CustomEvent('show-toast', {
                        detail: {
                            message: `This episode can't be played right now.`,
                            duration: 3000, // 3 seconds
                        },
                    }),
                );
            } else if (this.isPlaying) {
                store.dispatch(pause());
            } else {
                store.dispatch(listenEpisode(this.episodeId));
            }
        });
    }

    get isPlaying() {
        const { player, episodeId } = this;
        return player.isPlaying && episodeId === player.episode;
    }

    get canPlay() {
        const { episodeId, info, isPlaying } = this;

        const isDeviceOnline = info.isOnline;
        const isEpisodeOffline = info.episodes[episodeId] && info.episodes[episodeId].offline;

        return Boolean(isPlaying || isDeviceOnline || isEpisodeOffline);
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
        return [this.extended && 'extended', !this.canPlay && 'unavailable'].filter(Boolean).join(' ');
    }

    get pillMessage() {
        const { episode, extended, isPlaying } = this;

        if (!extended) {
            return '';
        }

        let message = isPlaying ? 'Pause' : 'Play';
        if (episode && episode.data) {
            message += ` • ${convertMilliseconds(episode.data.duration).minutes} min`;
        }

        return message;
    }
}
