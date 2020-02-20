import { createElement, register } from 'lwc';
import { registerWireService } from 'wire-service';

import App from 'rcast/app';

registerWireService(register);

document.body.appendChild(
    createElement('rcast-app', {
        is: App,
        fallback: false,
    }),
);

if ('serviceWorker' in navigator) {
    // Register service worker after page load event to avoid delaying critical requests for the
    // initial page load.
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
    });
}
