import { createElement, register } from 'lwc';
import { registerWireService } from '@lwc/wire-service';

import App from 'rcast/app';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/sw.js');
    });
}

registerWireService(register);

const bar = createElement('rcast-app', {
    is: App,
    fallback: false,
});
document.body.appendChild(bar);
