const PODCAST_URL = '/public/podcasts/20170414_hibt_podcast-7ff7d02b-3ff9-4e59-bff5-54b613c918d6.mp3';

window.addEventListener('click', () => {
    const player = new Player();
    player.play(PODCAST_URL);
})

class Player {
    audioContext;
    audioEl;
    track;

    _initIfNeeded() {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }

        if (!this.audioEl) {
            this.audioEl = new Audio();
            
            this.audioEl.addEventListener('canplaythrough', () => {
                console.log('can play')
            });

            this.audioEl.addEventListener('durationchange', () => {
                console.log('durationchange', this.audioEl.duration);
            });

            this.audioEl.addEventListener('timeupdate', () => {
                console.log('time updated', this.audioEl.currentTime)
            });
        }

        if (!this.track) {
            this.track = this.audioContext.createMediaElementSource(this.audioEl);


            this.track.connect(this.audioContext.destination);
        }
    }

    play(url) {
        this._initIfNeeded();
        this.audioEl.src = url;
        this.audioEl.play();
        this.audioEl.playbackRate = 2.0;
    }
}