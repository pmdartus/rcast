import { LightningElement, track, wire } from 'lwc';

import { connectStore, store } from 'rcast/store';

export default class PlayerCondensed extends LightningElement {
    @track isPlaying = false;
    @track episode = null;
    @track podcast = null;

    @wire(connectStore, { store })
    storeChange({ player, episodes }) {
        this.isPlaying = player.isPlaying;

        if (player.episode) {
            this.episode = episodes[player.episode].data;
        }
    }

    get cover() {
        // TODO: Improve image lookup
        return this.episode && this.episode.image;
    }

    get title() {
        return this.episode && this.episode.title;
    }

    get author() {
        return this.podcast && this.podcast.author.name;
    }

    handleHeadClick() {
        console.log('click head')
    }

    handlePlayPauseClick(event) {
        // Stop the event propagation to avoid being handled like a click on the head.
        event.stopPropagation();
    }
}
