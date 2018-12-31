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

    @api push(nextView) {
        const activeView = this.getActiveView();

        nextView.classList.add('page-fade-in');
        
        this.views.push(nextView);
        this.container.appendChild(nextView);

        setTimeout(() => {
            nextView.classList.add('page-active');
            nextView.classList.remove('page-fade-in');

            activeView.classList.add('page-fade-out');
            activeView.classList.remove('page-active');

            activeView.addEventListener('transitionend', () => {
                activeView.classList.add('page-hidden');
            }, {
                once: true
            });
        });
    }

    @api pop() {
        const activeView = this.views.pop();

        const nextView = this.getActiveView();
        nextView.classList.remove('page-hidden');

        setTimeout(() => {
            nextView.classList.remove('page-fade-out');
            nextView.classList.add('page-active');

            activeView.classList.add('page-fade-in');
            activeView.classList.remove('page-active');

            activeView.addEventListener('transitionend', () => {
                activeView.remove();
            }, {
                once: true
            });
        });
    }

    getActiveView() {
        return this.views[this.views.length - 1];
    }

    renderedCallback() {
        if (!this.container) {
            this.container = this.template.querySelector('.container');

            const { root } = this;
            if (root) {
                root.classList.add('page');
                root.classList.add('page-active');

                this.container.appendChild(root);
            }
        }
    }

    handleNavstackpush(event) {
        event.stopPropagation();

        const { element } = event.detail;
        element.classList.add('page');

        this.push(element);
    }

    handleNavstackpop(event) {
        event.stopPropagation();
        this.pop();
    }
}