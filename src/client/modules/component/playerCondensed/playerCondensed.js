import { LightningElement, track, wire } from 'lwc';

import { connectStore, store, play, pause } from 'store/store';

export default class PlayerCondensed extends LightningElement {
    episodeId = null;

    @track episode = null;
    @track podcast = null;

    @track isPlaying = false;
    @track progress = 0;

    _audioContext;
    _audioEl;

    _duration = 0;

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

            if (!this._audioEl) {
                this._initAudio();
            }

            this._audioEl.src = `/proxy/${encodeURI(this.episode.audio.url)}`;
            if (this.isPlaying) {
                this._audioEl.play();
            }
        }

        this.setPlayerVisibility();

        if (this.isPlaying !== player.isPlaying) {
            this.isPlaying = player.isPlaying;

            if (this.isPlaying) {
                this._audioEl.play();
            } else {
                this._audioEl.pause();
            }
        }
    }

    setPlayerVisibility() {
        this.episode ? 
            this.classList.add('visible') :
            this.classList.remove('visible');
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

    get progressBarStyle() {
        return `width: ${Math.round(this.progress * 100)}%`;
    }

    handleHeadClick() {
        console.log('click head');
    }

    handlePlayPauseClick(event) {
        event.stopPropagation();
        store.dispatch(this.isPlaying ? pause() : play());
    }

    _initAudio() {
        this._audioContext = new AudioContext();
        
        this._audioEl = new Audio();
        this._audioEl.crossOrigin = 'anonymous';

        this._audioEl.addEventListener('error', () => {
                const { code, message } = this._audioEl.error;
                console.error(`Error ${code}: ${message}`);
        });

        this._audioEl.addEventListener('durationchange', () => {
            this._duration = this._audioEl.duration;
        });

        this._audioEl.addEventListener('timeupdate', () => {
            this.progress = this._audioEl.currentTime / this._duration;
        });

        const track = this._audioContext.createMediaElementSource(this._audioEl);
        track.connect(this._audioContext.destination);
    }
}
