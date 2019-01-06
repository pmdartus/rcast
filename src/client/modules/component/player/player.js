import { LightningElement, api, track, wire } from 'lwc';

import player from 'store/player';
import { connectStore, store } from 'store/store';
import { play, pause } from 'store/actions';

const STEP_DURATION = 15;

export default class Player extends LightningElement {
    episodeId = null;

    @track episode = null;
    @track podcast = null;

    @track duration = 0;
    @track currentTime = 0;

    @wire(connectStore, { store })
    storeChange({ player, episodes, podcasts }) {
        this.isPlaying = player.isPlaying;

        const episodeId = player.episode;

        if (!episodes[episodeId]) {
            return;
        }

        const episode = episodes[episodeId].data;
        const podcast = podcasts[episode.podcastId].data;

        if (this.episodeId !== episodeId) {
            this.episodeId = episodeId;
            this.episode = episode;
            this.podcast = podcast;
        }
    }

    connectedCallback() {
        player.on('timeupdate', this.handleTimeUpdate);
    }

    disconnectedCallback() {
        player.off('timeupdate', this.handleTimeUpdate);
    }

    handleTimeUpdate = () => {
        this.duration = player.duration;
        this.currentTime = player.currentTime;
    };

    get cover() {
        return this.podcast && this.podcast.image;
    }

    get title() {
        return this.episode && this.episode.title;
    }

    get author() {
        return this.podcast && this.podcast.author.name;
    }

    @api show() {
        this.classList.add('visible');
    }

    hide() {
        this.classList.remove('visible');
    }

    handleArrowDownClick() {
        this.hide();
    }

    handlePlayPauseClick() {
        store.dispatch(this.isPlaying ? pause() : play());
    }

    handleRewindClick() {
        player.currentTime = player.currentTime - STEP_DURATION;
    }

    handleFastForwardClick() {
        player.currentTime = player.currentTime + STEP_DURATION;
    }

    handleCurrentTimeChange(evt) {
        const {
            detail: { value },
        } = evt;
        player.currentTime = value;
    }
}
