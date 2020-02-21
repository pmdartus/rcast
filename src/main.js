import { createElement, register } from 'lwc';
import { registerWireService } from 'wire-service';

import { Workbox } from 'workbox-window';

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

// Kickstart the service worker if available.
if ('serviceWorker' in navigator) {
    const sw = new Workbox('/sw.js');

    // Notify when the application is ready to be used offline.
    // https://developers.google.com/web/tools/workbox/modules/workbox-window
    sw.addEventListener('activated', evt => {
        if (!evt.isUpdate) {
            window.dispatchEvent(
                new CustomEvent('show-toast', {
                    detail: {
                        message: 'Rcast is ready to be used offline.',
                        duration: 3000, // 3 seconds
                    },
                }),
            );
        }
    });

    // Offer a way to reload the application, when there is a pending update.
    // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
    sw.addEventListener('waiting', evt => {
        if (evt.wasWaitingBeforeRegister) {
            return;
        }

        const buttons = [
            {
                text: 'Reload',
                callback() {
                    sw.addEventListener('controlling', () => {
                        window.location.reload();
                    });

                    sw.messageSW({ type: 'SKIP_WAITING' });
                },
            },
            {
                text: 'Dismiss',
                callback(notification) {
                    notification.dismiss();
                },
            },
        ];

        window.dispatchEvent(
            new CustomEvent('show-toast', {
                detail: {
                    message: 'Rcast is ready to be used offline.',
                    buttons,
                },
            }),
        );
    });

    sw.register();
}
