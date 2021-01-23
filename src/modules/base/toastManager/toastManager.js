import { createElement } from 'lwc';

import Toast from 'base/toast';

window.addEventListener('show-toast', (evt) => {
    const { detail } = evt;

    if (!detail) {
        return;
    }

    const { message = '', buttons = [], duration = 0 } = detail;

    const toast = createElement('base-toast', { is: Toast });
    toast.message = message;
    toast.buttons = buttons;
    toast.duration = duration;

    document.body.appendChild(toast);
});
