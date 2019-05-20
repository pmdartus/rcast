import { createElement } from 'lwc';
import Category from './../category';

describe('Category', () => {
    it('should render an image tag', () => {
        const elm = createElement('test-image', { is: Category });
        elm.categoryId = 1301;
        document.body.appendChild(elm);
        expect(elm.shadowRoot.innerHTML).toBe(
            '<base-header><base-back-button slot="left"></base-back-button>Arts</base-header><base-content class="with-header"><div class="center"><base-spinner></base-spinner></div></base-content>',
        );
    });
});
