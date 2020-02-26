import * as api from 'rcast/api';
import { isEpisodeOffline } from 'rcast/download';

import { RECORD_TYPE_FULL } from '../../constants';
import { REQUEST_SHOW, RECEIVE_SHOW_SUCCESS, RECEIVE_SHOW_ERROR } from './constants';

function requestShow(showId) {
    return {
        type: REQUEST_SHOW,
        id: showId,
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

            const episodes = await Promise.all(
                showEpisodeResponse.response.items.map(async episode => {
                    const offline = await isEpisodeOffline(episode.episode_id);
                    return {
                        ...episode,
                        offline,
                    };
                }),
            );

            dispatch(
                receiveShowSuccess(showId, {
                    show: showResponse.response.show,
                    episodes,
                }),
            );
        } catch (error) {
            dispatch(receiveShowError(showId, error));
        }
    };
}

function shouldFetchShow(state, showId) {
    return !state.shows[showId] || state.shows[showId].type !== RECORD_TYPE_FULL;
}

export function fetchShowIfNeeded(showId) {
    return (dispatch, getState) => {
        const state = getState();

        if (shouldFetchShow(state, showId)) {
            dispatch(fetchShow(showId));
        }
    };
}

export function fetchSubscribedShowsIfNeeded() {
    return (dispatch, getState) => {
        const state = getState();

        for (const id of state.info.subscriptions) {
            if (shouldFetchShow(state, id)) {
                dispatch(fetchShow(id));
            }
        }
    };
}
