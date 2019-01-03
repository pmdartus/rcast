export function convertSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);

    return {
        minutes,
        seconds: remainder,
    };
}
