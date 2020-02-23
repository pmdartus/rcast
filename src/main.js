import { createElement, register } from 'lwc';
import { registerWireService } from 'wire-service';

import 'sw/window';
import 'base/toastManager';
import App from 'rcast/app';
import { store } from 'store/store';
import { connectivityStatusChanged } from 'store/actions';

// Register custom wire adapters.
registerWireService(register);

// Dispatch the connectivity status change into Redux.
function updateOnlineStatus() {
    store.dispatch(connectivityStatusChanged());
}
window.addEventListener('offline', updateOnlineStatus);
window.addEventListener('online', updateOnlineStatus);

// Mont the application.
document.body.appendChild(
    createElement('rcast-app', {
        is: App,
    }),
);
