import { getProxyfiedUrl } from 'rcast/api';

import {
    SUBSCRIBE_SHOW,
    UNSUBSCRIBE_SHOW,
    DOWNLOAD_EPISODE_PROGRESS,
    DOWNLOAD_EPISODE_DONE,
    DOWNLOAD_EPISODE_ERROR,
    DISCARD_DOWNLOADED_EPISODE,
} from './constants';

export function subscribe(showId) {
    return { type: SUBSCRIBE_SHOW, id: showId };
}

export function unsubscribe(showId) {
    return { type: UNSUBSCRIBE_SHOW, id: showId };
}

function downloadEpisodeProgress(episodeId, progress = 0) {
    return {
        type: DOWNLOAD_EPISODE_PROGRESS,
        id: episodeId,
        progress,
    };
}

function downloadEpisodeDone(episodeId) {
    return {
        type: DOWNLOAD_EPISODE_DONE,
        id: episodeId,
    };
}

function downloadEpisodeError(episodeId) {
    return {
        type: DOWNLOAD_EPISODE_ERROR,
        id: episodeId,
    };
}

export function downloadEpisode(episodeId) {
    return async (dispatch, getState) => {
        const state = getState();
        if (state.info.episodes[episodeId] && state.info.episodes[episodeId].offline) {
            return;
        }

        dispatch(downloadEpisodeProgress(episodeId));

        const episode = state.episodes[episodeId].data;
        const xhr = new XMLHttpRequest();

        xhr.addEventListener('progress', evt => {
            const progress = evt.loaded / evt.total;
            dispatch(downloadEpisodeProgress(episodeId, progress));
        });

        xhr.addEventListener('load', () => {
            // TODO: Add check if the response is actually in the cache at this point.
            dispatch(downloadEpisodeDone(episodeId));
        });

        const handleErrorState = () => {
            dispatch(downloadEpisodeError(episodeId));
        };

        xhr.addEventListener('error', handleErrorState);
        xhr.addEventListener('abort', handleErrorState);

        xhr.open('GET', getProxyfiedUrl(episode.playback_url));
        xhr.send();
    };
}

export function discardDownloadedEpisode(episodeId) {
    return async (dispatch, getState) => {
        const state = getState();

        if (!state.info.episodes[episodeId] || !state.info.episodes[episodeId].offline) {
            return;
        }

        dispatch({
            type: DISCARD_DOWNLOADED_EPISODE,
            id: episodeId,
        });
    };
}
