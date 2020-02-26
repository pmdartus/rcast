import { PLAY, PAUSE, ENDED, LISTEN_EPISODE } from './constants';

export function play() {
    return { type: PLAY };
}

export function pause() {
    return { type: PAUSE };
}

export function ended() {
    return { type: ENDED };
}

export function listenEpisode(episodeId) {
    return { type: LISTEN_EPISODE, id: episodeId };
}
