/* eslint-disable no-console */

const LOCAL_STORAGE_KEY = 'state';
const DEBOUNCE_DURATION = 500;

function debounce(fn, duration) {
    let timer;
    return function(...args) {
        const thisValue = this;

        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            fn.apply(thisValue, args);
            timer = null;
        }, duration);
    };
}

export function loadState() {
    try {
        const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (serializedState) {
            return JSON.parse(serializedState);
        }
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('Failed to load state from localStorage', error);
        }
    }
}

function saveState({ info }) {
    try {
        const serializedState = JSON.stringify({
            info,
        });
        localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('Failed to save state from localStorage', error);
        }
    }
}

const debouncedSave = debounce(saveState, DEBOUNCE_DURATION);

const localStorageMiddleware = store => next => action => {
    next(action);
    debouncedSave(store.getState());
};

export default localStorageMiddleware;
