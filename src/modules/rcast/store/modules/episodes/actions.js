import * as api from 'rcast/api';

import { RECORD_TYPE_FULL } from '../../constants';
import { REQUEST_EPISODE, RECEIVE_EPISODE_SUCCESS, RECEIVE_EPISODE_ERROR } from './constants';

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
            const episodeResponse = await api.fetchEpisode(episodeId);
            const { episode } = episodeResponse.response;

            dispatch(receiveEpisodeSuccess(episodeId, episode));
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

export function fetchSubscribedPodcastsIfNeeded() {
    throw new Error('TODO');
}
