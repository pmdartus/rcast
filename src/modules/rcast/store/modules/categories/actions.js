import * as api from 'rcast/api';

import { REQUEST_CATEGORY, RECEIVE_CATEGORY_SUCCESS, RECEIVE_CATEGORY_ERROR } from './constants';

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

function shouldFetchCategory({ categories }, categoryId) {
    return !categories[categoryId] || !categories[categoryId].data;
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
