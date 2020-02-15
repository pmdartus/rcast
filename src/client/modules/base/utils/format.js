import { convertMilliseconds } from './time-conversion';

export function formatTime(seconds) {
    const res = convertMilliseconds(seconds);
    return `${res.minutes}:${res.seconds.toString().padStart(2, '0')}`;
}
