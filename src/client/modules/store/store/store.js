import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import * as reducers from './reducers';
import loggerMiddleware from './middlewares/logger';
import localStorageMiddleware, { loadState } from './middlewares/localstorage';

const middlewares = [thunk, localStorageMiddleware];

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    middlewares.push(loggerMiddleware);
}

export const store = createStore(combineReducers(reducers), loadState(), applyMiddleware(...middlewares));

export { connectStore } from './wire-adapter';
