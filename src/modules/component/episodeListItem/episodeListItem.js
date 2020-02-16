import { LightningElement, api } from 'lwc';

import { store } from 'store/store';
import { listenEpisode } from 'store/actions';
import { convertMilliseconds } from 'base/utils';

const currentYearDateFormatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: undefined,
});

const previousYearsDateFormatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

function formatReleaseDate(date) {
    const isCurrentYear = new Date().getFullYear() === date.getFullYear();
    const dateFormatter = isCurrentYear ? currentYearDateFormatter : previousYearsDateFormatter;

    return dateFormatter.format(date);
}

export default class EpisodeListItem extends LightningElement {
    @api episode;

    get title() {
        return this.episode.title;
    }

    get releaseDate() {
        const releaseDate = new Date(this.episode.published_at);
        return formatReleaseDate(releaseDate);
    }

    get duration() {
        const { minutes } = convertMilliseconds(this.episode.duration);
        return `${minutes}m`;
    }

    handlePlayClick(event) {
        event.stopPropagation();

        store.dispatch(listenEpisode(this.episode.episode_id));
    }
}
