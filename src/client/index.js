import { createElement } from 'lwc';
import App from 'rcast/app';

const bar = createElement('rcast-app', {
    is: App,
    fallback: false,
});
document.body.appendChild(bar);