import { listEpisodes } from './api';

const rootEl = document.querySelector('#root');
const playPauseEl = document.querySelector('#root button');
const volumeEl = document.querySelector('#volume');

listEpisodes({
    podcastId: '47970'
}).then(res => {
    const { content_type: contentType, enclosure: mediaUrl } = res.episodes[0];

    const audioEl = document.createElement('audio');
    audioEl.src = `/api/stream/${encodeURIComponent(mediaUrl)}`;
    audioEl.type = contentType;
    audioEl.crossOrigin = 'anonymous';

    document.body.appendChild(audioEl);

    const audioCtx = new AudioContext();
    const track = audioCtx.createMediaElementSource(audioEl);

    const gainNode = audioCtx.createGain();

    track.connect(gainNode).connect(audioCtx.destination);

    playPauseEl.addEventListener('click', () => {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    
        // play or pause track depending on state
        if (playPauseEl.dataset.playing === 'false') {
            audioEl.play();
            playPauseEl.dataset.playing = 'true';
        } else if (playPauseEl.dataset.playing === 'true') {
            audioEl.pause();
            playPauseEl.dataset.playing = 'false';
        }    
    })

    volumeEl.addEventListener('change', () => {
        gainNode.gain.value = volumeEl.value;
    });

    audioEl.addEventListener('ended', () => {
        playPauseEl.dataset.playing = 'false';
    }, false);
});