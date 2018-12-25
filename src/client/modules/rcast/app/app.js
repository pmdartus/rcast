import { LightningElement, createElement } from 'lwc';

import ViewPodcasts from 'rcast/viewPodcasts';
import ViewDiscover from 'rcast/viewDiscover';

export default class App extends LightningElement {
    views = {
        podcasts: createElement('rcast-view-podcasts', {
            is: ViewPodcasts,
            fallback: false,
        }),
        discover: createElement('rcast-view-discover', {
            is: ViewDiscover,
            fallback: false,
        }),
    };
}
