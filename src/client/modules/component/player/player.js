import { LightningElement, api, track, wire } from 'lwc';
import { connectStore, store } from 'store/store';

const PROGRESS_STEP = 15;

export default class Player extends LightningElement {
    episodeId = null;

    @track episode = null;
    @track podcast = null;

    @track state = {
        playing: false,
        canPlay: false,
        duration: 100,
        currentTime: 0,
    };

    @wire(connectStore, { store })
    storeChange({ player, episodes, podcasts }) {
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
        const { _audioCtx, _audioElRef, state } = this;

        // check if context is in suspended state (autoplay policy)
        if (_audioCtx.state === 'suspended') {
            _audioCtx.resume();
        }

        if (state.playing) {
            state.playing = false;
            _audioElRef.pause();
        } else {
            state.playing = true;
            _audioElRef.play();
        }
    }

    handleCurrentTimeChange(event) {
        const { state, _audioElRef } = this;
        const { currentTime } = event.target;

        state.currentTime = currentTime;
        _audioElRef.currentTime = currentTime;
    }

    handleRewindClick() {
        const { state, _audioElRef } = this;
        const progress = Math.max(0, state.currentTime - PROGRESS_STEP);

        // By only updating the `currentTime` property on the <audio> tag and wait for the timeUpdated event to fire to
        // reflect the updated time in the component internal state creates flickering on the screen. We want to make 
        // sure that the component internal state `progress` is in sync with the <audio> tag `currentTime`
        state.currentTime = progress;
        _audioElRef.currentTime = progress;
    }

    // TODO: Make time update generic
    handleFastForwardClick() {
        const { state, _audioElRef } = this;
        const progress = Math.min(state.duration, state.currentTime + PROGRESS_STEP);

        state.currentTime = progress;
        _audioElRef.currentTime = progress;
    }

    handleProgressChange(event) {
        const { state, _audioElRef } = this;
        const progressBarValue = event.target.value;

        if (state.canPlay) {
            const progress = state.duration / progressBarValue;

            state.currentTime = progress;
            _audioElRef.currentTime = progress;
        }
    }

    handleAudioCanPlay(event) {
        const { state } = this;
        const { target } = event;

        state.canPlay = true;
        state.duration = target.duration;
    }

    handleAudioTimeUpdate(event) {
        const { state } = this;
        const { target } = event;

        state.currentTime = target.currentTime;
    }

    handleAudioError(event) {
        const { target } = event;

        // eslint-disable-next-line
        console.error(target.error);

        // TODO - Handle loading error gracefully
    }

    handleAudioEnded() {
        this.state.playing = false;
    }
}