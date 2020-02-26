import { Workbox } from 'workbox-window';

export let workbox = null;
export let swRegistration = Promise.resolve(null);

if ('serviceWorker' in navigator) {
    workbox = new Workbox('/sw.js');

    listenForActivation(workbox);
    listenForUpdates(workbox);

    swRegistration = workbox.register();
}

/**
 * Notify when the application is ready to be used offline.
 * https://developers.google.com/web/tools/workbox/modules/workbox-window
 */
function listenForActivation(workbox) {
    workbox.addEventListener('activated', evt => {
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
}

/**
 * Offer a way to reload the application, when there is a pending update.
 * https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
 */
function listenForUpdates(workbox) {
    workbox.addEventListener('waiting', () => {
        const buttons = [
            {
                text: 'Reload',
                callback() {
                    workbox.addEventListener('controlling', () => {
                        window.location.reload();
                    });

                    workbox.messageSW({ type: 'SKIP_WAITING' });
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
}
