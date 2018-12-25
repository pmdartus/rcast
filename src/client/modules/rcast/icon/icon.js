import { LightningElement, api } from 'lwc';
import * as templates from './templates';


export default class Icon extends LightningElement {
    @api name;

    render() {
        const { name } = this;

        if (!templates[name]) {
            // eslint-disable-next-line no-console
            console.warn(`Missing template for icon name "${name}"`);
        }

        return templates[name];
    }
}