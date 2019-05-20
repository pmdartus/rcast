import { LightningElement, api } from 'lwc';

let COVER_INTERSECTION_OBSERVER = undefined;

export default class Cover extends LightningElement {
    @api href;
    @api name;
    @api roundedCorners = false;

    shouldLoad = false;

    @api _load() {
        // Do nothing if the component was already asked to load
        if (this.shouldLoad) {
            return;
        }

        const img = this.template.querySelector('img');

        // Remove placeholder once the image has loaded
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });

        img.src = this.href;
    }

    connectedCallback() {
        if (COVER_INTERSECTION_OBSERVER === undefined) {
            COVER_INTERSECTION_OBSERVER = new IntersectionObserver(
                entries => {
                    for (const entry of entries) {
                        if (entry.isIntersecting) {
                            entry.target._load();
                        }
                    }
                },
                {
                    root: document.body,
                    rootMargin: '100%',
                },
            );
        }
        COVER_INTERSECTION_OBSERVER.observe(this.template.host);
    }

    get imgClassName() {
        return [this.roundedCorners && 'rounded-corners'].filter(Boolean).join(' ');
    }
}
