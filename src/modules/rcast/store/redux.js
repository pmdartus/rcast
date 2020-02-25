import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import logger from './middlewares/logger';
import localStorage, { loadState } from './middlewares/localstorage';

import application from './modules/application/reducers';
import categories from './modules/categories/reducers';
import episodes from './modules/episodes/reducers';
import info from './modules/info/reducers';
import player from './modules/player/reducers';
import show from './modules/shows/reducers';
import users from './modules/users/reducers';

let middlewares = [thunk, localStorage];
if (process.env.NODE_ENV !== 'production') {
    middlewares = [...middlewares, logger];
}

const reducers = {
    application,
    categories,
    episodes,
    info,
    player,
    show,
    users,
};

export const store = createStore(combineReducers(reducers), loadState(), applyMiddleware(...middlewares));
