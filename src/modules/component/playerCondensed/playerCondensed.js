import { LightningElement, track, wire } from 'lwc';

import player from 'store/player';
import { connectStore, store } from 'store/store';
import { play, pause } from 'store/actions';

export default class PlayerCondensed extends LightningElement {
    episodeId = null;

    @track episode = null;
    @track podcast = null;
    @track author = null;

    @track isPlaying = false;
    @track progress = 0;

    _audioContext;
    _audioEl;

    _duration = 0;

    @wire(connectStore, { store })
    storeChange({ player, episodes, podcasts, users }) {
        this.isPlaying = player.isPlaying;

        const episodeId = player.episode;

        if (!episodes[episodeId]) {
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

        this.setPlayerVisibility();
    }

    connectedCallback() {
        player.on('timeupdate', this.handleTimeUpdate);
    }

    disconnectedCallback() {
        player.off('timeupdate', this.handleTimeUpdate);
    }

    handleTimeUpdate = () => {
        const { duration, currentTime } = player;
        this.progress = Number.isNaN(duration) || currentTime === 0 ? 0 : currentTime / duration;
    };

    setPlayerVisibility() {
        this.episode ? this.classList.add('visible') : this.classList.remove('visible');
    }

    get cover() {
        return this.podcast && this.podcast.image_url;
    }

    get title() {
        return this.episode && this.episode.title;
    }

    get authorName() {
        return this.author && this.author.fullname;
    }

    get progressBarStyle() {
        return `width: ${Math.round(this.progress * 100)}%`;
    }

    handlePlayPauseClick(event) {
        event.stopPropagation();
        store.dispatch(this.isPlaying ? pause() : play());
    }
}
