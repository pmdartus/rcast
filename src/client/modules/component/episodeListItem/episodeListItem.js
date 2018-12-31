import { LightningElement, api } from 'lwc';

import { convertSeconds } from 'base/utils';
import { store, listenEpisode } from 'store/store';

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

export default class EpisodeListItem extends LightningElement {
    @api episode;

    get title() {
        return this.episode.title;
    }

    get releaseDate() {
        const releaseDate = new Date(this.episode.publication_date);

        const isCurrentYear = (new Date()).getFullYear() === releaseDate.getFullYear();
        const dateFormatter = isCurrentYear ? currentYearDateFormatter : previousYearsDateFormatter;

        return dateFormatter.format(releaseDate);
    }

    get duration() {
        const { minutes } = convertSeconds(this.episode.duration);
        return `${minutes}m`;
    }

    handlePlayClick(event) {
        event.stopPropagation();

        store.dispatch(
            listenEpisode(this.episode.id)
        );
    }
}