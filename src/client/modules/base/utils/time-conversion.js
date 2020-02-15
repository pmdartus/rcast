export function convertMilliseconds(ms) {
    const minutes = Math.floor(ms / (60 * 1000));
    const remainder = Math.floor(ms % (60 * 1000));

    return {
        minutes,
        seconds: remainder,
    };
}
