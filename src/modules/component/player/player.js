import { LightningElement, api, track, wire } from 'lwc';

import player from 'rcast/player';
import { connectStore, store } from 'rcast/store';
import { play, pause } from 'rcast/store';

const STEP_DURATION = 15;

export default class Player extends LightningElement {
    episodeId = null;

    @track episode = null;
    @track podcast = null;
    @track author = null;

    @track duration = 0;
    @track currentTime = 0;

    @wire(connectStore, { store })
    storeChange({ player, episodes, podcasts, users }) {
        this.isPlaying = player.isPlaying;

        const episodeId = player.episode;

        if (!episodes[episodeId] || episodes[episodeId].isFetching) {
            return;
        }

        const episode = episodes[episodeId].data;
        const podcast = podcasts[episode.show_id].data;
        const author = users[episode.author_id].data;

        if (this.episodeId !== episodeId) {
            this.episodeId = episodeId;
            this.episode = episode;
            this.podcast = podcast;
            this.author = author;
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
        return this.episode && this.episode.image_original_url;
    }

    get title() {
        return this.episode && this.episode.title;
    }

    get authorName() {
        return this.podcast && this.author.fullname;
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
