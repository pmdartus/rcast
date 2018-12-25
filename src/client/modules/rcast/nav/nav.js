import { LightningElement, api } from 'lwc';

export default class Nav extends LightningElement {
    views = [];
    container;

    @api 
    set root(el) {
        this.views = [
            el
        ];
    }
    get root() {
        return this.views[0];
    }

    @api push(el) {
        const activeView = this.getActiveView();
        activeView.classList.add('page-hidden');

        this.views.push(el);
        this.container.appendChild(el);
    }

    @api pop() {
        const removedView = this.views.pop();
        removedView.parentElement.removeChild(removedView);

        const activeView = this.getActiveView();
        activeView.classList.remove('page-hidden');
    }

    getActiveView() {
        return this.views[this.views.length - 1];
    }

    renderedCallback() {
        if (!this.container) {
            this.container = this.template.querySelector('.container');

            const { root } = this;
            if (root) {
                this.container.appendChild(root);
            }
        }
    }

    handleNavstackpush(event) {
        event.stopPropagation();

        const { element } = event.detail;
        this.push(element);
    }

    handleNavstackpop(event) {
        event.stopPropagation();
        this.pop();
    }
}