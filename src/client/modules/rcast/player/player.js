import { LightningElement, api, track } from 'lwc';

const PROGRESS_STEP = 15;

export default class Player extends LightningElement {
    @api titleText = null;
    @api mediaUrl = null;
    @api coverUrl = null;

    @track state = {
        playing: false,
        canPlay: false,
        duration: 0,
        currentTime: 0,
    };

    _audioCtx = new AudioContext();
    _audioElRef;


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
        console.error(target.error);
        // TODO - Handle loading error gracefully
    }

    handleAudioEnded() {
        this.state.playing = false;
    }

    renderedCallback() {
        if (!this._audioElRef) {
            this._audioElRef = this.template.querySelector('audio');

            this._audioCtx
                .createMediaElementSource(this._audioElRef)
                .connect(this._audioCtx.destination);
        }
    }
}