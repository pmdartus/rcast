import {
    CONNECTIVITY_STATUS_CHANGED,
    REQUEST_SHOW,
    RECEIVE_SHOW_SUCCESS,
    RECEIVE_SHOW_ERROR,
    REQUEST_EPISODE,
    RECEIVE_EPISODE_SUCCESS,
    RECEIVE_EPISODE_ERROR,
    REQUEST_CATEGORY,
    RECEIVE_CATEGORY_SUCCESS,
    RECEIVE_CATEGORY_ERROR,
    SUBSCRIBE_PODCAST,
    UNSUBSCRIBE_PODCAST,
    PLAY,
    PAUSE,
    ENDED,
    DOWNLOAD_EPISODE_PROGRESS,
    DOWNLOAD_EPISODE_DONE,
    DOWNLOAD_EPISODE_ERROR,
    DISCARD_DOWNLOADED_EPISODE,
    LISTEN_EPISODE,
    RECORD_TYPE_FULL,
} from 'store/shared';
import { getNoCorsUrl } from 'base/utils';

import * as api from './api';

export function connectivityStatusChanged() {
    return {
        type: CONNECTIVITY_STATUS_CHANGED,
        isOnline: navigator.onLine,
    };
}

function requestShow(podcast) {
    return {
        type: REQUEST_SHOW,
        id: podcast,
    };
}

function receiveShowSuccess(showId, data) {
    return {
        type: RECEIVE_SHOW_SUCCESS,
        id: showId,
        data,
    };
}

function receiveShowError(showId, error) {
    return {
        type: RECEIVE_SHOW_ERROR,
        id: showId,
        error,
    };
}

function fetchShow(showId) {
    return async dispatch => {
        dispatch(requestShow(showId));

        try {
            const [showResponse, showEpisodeResponse] = await Promise.all([
                api.fetchShow(showId),
                api.fetchShowEpisodes(showId),
            ]);

            dispatch(
                receiveShowSuccess(showId, {
                    show: showResponse.response.show,
                    episodes: showEpisodeResponse.response.items,
                }),
            );
        } catch (error) {
            dispatch(receiveShowError(showId, error));
        }
    };
}

function shouldFetchShow(state, showId) {
    return !state.podcasts[showId] || state.podcasts[showId].type !== RECORD_TYPE_FULL;
}

export function fetchShowIfNeeded(showId) {
    return (dispatch, getState) => {
        const state = getState();

        if (shouldFetchShow(state, showId)) {
            dispatch(fetchShow(showId));
        }
    };
}

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

function requestCategory(categoryId) {
    return {
        type: REQUEST_CATEGORY,
        categoryId,
    };
}

function receiveCategorySuccess(categoryId, data) {
    return {
        type: RECEIVE_CATEGORY_SUCCESS,
        categoryId,
        data,
    };
}

function receiveCategoryError(categoryId, error) {
    return {
        type: RECEIVE_CATEGORY_ERROR,
        categoryId,
        error,
    };
}

function shouldFetchCategory({ topShowsByCategory }, categoryId) {
    return !topShowsByCategory[categoryId] || !topShowsByCategory[categoryId].data;
}

function fetchCategory(categoryId) {
    return async dispatch => {
        dispatch(requestCategory(categoryId));

        try {
            const categoryResponse = await api.fetchCategory(categoryId);
            const shows = categoryResponse.response.items;

            dispatch(receiveCategorySuccess(categoryId, shows));
        } catch (error) {
            dispatch(receiveCategoryError(categoryId, error));
        }
    };
}

export function fetchCategoryIfNeeded(categoryId) {
    return (dispatch, getState) => {
        if (shouldFetchCategory(getState(), categoryId)) {
            dispatch(fetchCategory(categoryId));
        }
    };
}

export function fetchSubscribedPodcastsIfNeeded() {
    return (dispatch, getState) => {
        const state = getState();

        for (const id of state.info.subscriptions) {
            // TODO: Avoid copy/paste
            if (shouldFetchShow(getState(), id)) {
                dispatch(fetchShow(id));
            }
        }
    };
}

export function subscribe(podcast) {
    return { type: SUBSCRIBE_PODCAST, id: podcast };
}

export function unsubscribe(podcast) {
    return { type: UNSUBSCRIBE_PODCAST, id: podcast };
}

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

        xhr.open('GET', getNoCorsUrl(episode.playback_url));
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
