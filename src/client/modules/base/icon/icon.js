import { LightningElement, api } from 'lwc';

import * as templates from './templates';
import sharedStylesheet from './icon.css';

Object.values(templates).forEach(tmpl => {
    tmpl.stylesheets = sharedStylesheet;
});

export default class Icon extends LightningElement {
    @api name;

    render() {
        const { name } = this;

        if (templates[name]) {
            return templates[name];
        } else {
            // eslint-disable-next-line no-console
            console.warn(`Missing template for icon name "${name}"`);
            return templates.void;
        }
    }
}
