import { PLAY, PAUSE, ENDED, LISTEN_EPISODE } from './constants';

export default function player(
    state = {
        episode: null,
        isPlaying: false,
    },
    action,
) {
    switch (action.type) {
        case PLAY:
            return {
                ...state,
                isPlaying: true,
            };

        case PAUSE:
            return {
                ...state,
                isPlaying: false,
            };

        case ENDED:
            return {
                ...state,
                isPlaying: false,
            };

        case LISTEN_EPISODE:
            return {
                episode: action.id,
                isPlaying: true,
            };

        default:
            return state;
    }
}
