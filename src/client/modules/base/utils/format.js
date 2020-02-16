import { convertSeconds } from './time-conversion';

export function formatTime(seconds) {
    const res = convertSeconds(seconds);
    return `${res.minutes}:${res.seconds.toString().padStart(2, '0')}`;
}
