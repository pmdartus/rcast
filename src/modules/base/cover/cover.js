import { LightningElement, api } from 'lwc';

let COVER_INTERSECTION_OBSERVER = new IntersectionObserver(
    entries => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const { target } = entry;

                // Invoke the load method on the cover element, and disconnect the intersection
                // observer to avoid repetitive invocation if the target happen to exit and enter
                // the viewport again.
                target._load();
                COVER_INTERSECTION_OBSERVER.unobserve(target);
            }
        }
    },
    {
        root: document.body,
        rootMargin: '100%',
    },
);

export default class Cover extends LightningElement {
    @api name;
    @api lazy = false;

    _inViewport = false;
    _href = null;

    @api
    get href() {
        return this._href;
    }
    set href(value) {
        this._href = value;
        this.loadCover();
    }

    @api
    get roundedCorners() {
        return this.getAttribute('rounded-corners') !== null;
    }
    set roundedCorners(value) {
        if (value === null) {
            this.removeAttribute('rounded-corners');
        } else {
            this.setAttribute('rounded-corners', '');
        }
    }

    @api _load() {
        if (!this._inViewport) {
            this._inViewport = true;
            this.loadCover();
        }
    }

    connectedCallback() {
        COVER_INTERSECTION_OBSERVER.observe(this.template.host);
    }

    disconnectedCallback() {
        COVER_INTERSECTION_OBSERVER.unobserve(this.template.host);
    }

    renderedCallback() {
        this.loadCover();
    }

    loadCover() {
        // Wait until the image is in the viewport and the image URL is set before rendering the
        // image.
        if (this.lazy && (!this._inViewport || !this._href)) {
            return;
        }

        const img = this.template.querySelector('img');
        if (!img) {
            return;
        }

        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });

        img.src = this.href;
    }
}
