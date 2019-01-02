const LOCAL_STORAGE_KEY = 'state';

export function loadState() {
    try {
        const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (serializedState) {
            return JSON.parse(serializedState);
        }
    } catch (error) {
        // Do nothing
    }
}

export function saveState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
    } catch (error) {
        // Do nothing
    }
}