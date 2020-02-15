import { LightningElement, api } from 'lwc';

let COVER_INTERSECTION_OBSERVER = new IntersectionObserver(
    entries => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const { target } = entry;

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
    @api roundedCorners = false;

    _inViewport = false;
    _href = null;

    @api 
    get href() {
        return this._href;
    }
    set href(value) {
        this._href = value;
        this.handleLoad();
    }

    @api _load() {
        if (!this._inViewport) {
            this._inViewport = true;
            this.handleLoad();
        }
    }

    connectedCallback() {
        COVER_INTERSECTION_OBSERVER.observe(this.template.host);
    }

    disconnectedCallback() {
        COVER_INTERSECTION_OBSERVER.unobserve(this.template.host);
    }

    get imgClassName() {
        return [this.roundedCorners && 'rounded-corners'].filter(Boolean).join(' ');
    }

    handleLoad() {
        // Wait until the image is in the viewport and the image URL is set before rendering the 
        // image.
        if (!this._inViewport && !this._href) {
            return;
        }

        const img = this.template.querySelector('img');
        if (!img) {
            return;
        }

        // Remove placeholder once the image has loaded
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });

        img.src = this.href;
    }
}
