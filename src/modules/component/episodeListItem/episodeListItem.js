import { LightningElement, api } from 'lwc';

import { convertMilliseconds, formatDate } from 'base/utils';

export default class EpisodeListItem extends LightningElement {
    @api episode;

    connectedCallback() {
        this.addEventListener('click', () => {
            this.dispatchEvent(
                new CustomEvent('navigate', {
                    detail: {
                        path: `/episodes/${this.episode.episode_id}`,
                    },
                    composed: true,
                    bubbles: true,
                }),
            );
        });
    }

    get releaseDate() {
        const releaseDate = new Date(this.episode.published_at);
        return formatDate(releaseDate);
    }

    get duration() {
        const { minutes } = convertMilliseconds(this.episode.duration);
        return `${minutes}m`;
    }
}
