import { convertSeconds } from './time-conversion';

export function formatTime(seconds) {
    const res = convertSeconds(seconds);
    return `${res.minutes}:${res.seconds.toString().padStart(2, '0')}`;
}

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

export function formatDate(date) {
    const isCurrentYear = new Date().getFullYear() === date.getFullYear();
    const dateFormatter = isCurrentYear ? currentYearDateFormatter : previousYearsDateFormatter;

    return dateFormatter.format(date);
}
