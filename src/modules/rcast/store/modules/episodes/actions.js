import * as api from 'rcast/api';
import * as downloadManager from 'rcast/download';

import { RECORD_TYPE_FULL } from '../../constants';
import {
    REQUEST_EPISODE,
    RECEIVE_EPISODE_SUCCESS,
    RECEIVE_EPISODE_ERROR,
    DISCARD_DOWNLOADED_EPISODE,
    DOWNLOAD_EPISODE_PROGRESS,
    DOWNLOAD_EPISODE_DONE,
    DOWNLOAD_EPISODE_ERROR,
} from './constants';

function requestEpisode(episodeId) {
    return {
        type: REQUEST_EPISODE,
        id: episodeId,
    };
}

function receiveEpisodeSuccess(episodeId, data) {
    return {
        type: RECEIVE_EPISODE_SUCCESS,
        id: episodeId,
        data,
    };
}

function receiveEpisodeError(episodeId, error) {
    return {
        type: RECEIVE_EPISODE_ERROR,
        id: episodeId,
        error,
    };
}

function fetchEpisode(episodeId) {
    return async dispatch => {
        dispatch(requestEpisode(episodeId));

        try {
            const [episodeResponse, offline] = await Promise.all([
                api.fetchEpisode(episodeId),
                downloadManager.isEpisodeOffline(episodeId),
            ]);

            dispatch(
                receiveEpisodeSuccess(episodeId, {
                    ...episodeResponse.response.episode,
                    offline,
                }),
            );
        } catch (error) {
            dispatch(receiveEpisodeError(episodeId, error));
        }
    };
}

export function fetchEpisodeIfNeeded(episodeId) {
    return (dispatch, getState) => {
        const state = getState();

        if (!state.episodes[episodeId] || state.episodes[episodeId].type !== RECORD_TYPE_FULL) {
            dispatch(fetchEpisode(episodeId));
        }
    };
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
    return async dispatch => {
        const isOffline = await downloadManager.isEpisodeOffline(episodeId);
        if (isOffline) {
            return;
        }

        dispatch(downloadEpisodeProgress(episodeId));

        const fetchRegistration = await downloadManager.downloadEpisode(episodeId);

        fetchRegistration.addEventListener('progress', () => {
            const { result } = fetchRegistration;

            if (result === 'success') {
                dispatch(downloadEpisodeDone(episodeId));
            } else if (result === 'failure') {
                dispatch(downloadEpisodeError(episodeId));
            } else {
                if (fetchRegistration.downloadTotal) {
                    const progress = fetchRegistration.downloaded / fetchRegistration.downloadTotal;
                    dispatch(downloadEpisodeProgress(episodeId, progress));
                }
            }
        });
    };
}

export function discardDownloadedEpisode(episodeId) {
    return async dispatch => {
        await downloadManager.removeDownloadedEpisode(episodeId);

        dispatch({
            type: DISCARD_DOWNLOADED_EPISODE,
            id: episodeId,
        });
    };
}
