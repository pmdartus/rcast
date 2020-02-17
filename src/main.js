import { createElement, register } from 'lwc';
import { registerWireService } from 'wire-service';

import App from 'rcast/app';

const availableFeature = detectFeatures();
const isCompatibleBrowser = Object.keys(availableFeature).some(feature => !availableFeature[feature]);

if (isCompatibleBrowser) {
    unsupportedErrorMessage(availableFeature);
} else {
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
}

function detectFeatures() {
    return {
        ['Web Audio API']: 'AudioContext' in window || 'webkitAudioContext' in window,
        ['Service Worker']: 'serviceWorker' in navigator,
        ['fetch']: 'fetch' in window,
    };
}

function unsupportedErrorMessage(availableFeature) {
    const { outdated } = window;
    outdated.style.display = 'unset';

    let message = `This browser doesn't support all the required features`;

    message += `<ul>`;
    for (const [name, available] of Object.entries(availableFeature)) {
        message += `<li><b>${name}:<b> ${available ? '✅' : '❌'}</li>`;
    }
    message += `</ul>`;

    outdated.querySelector('.unsupported_message').innerHTML = message;
}
