export const PROXY_BASE_URL = 'https://cors-anywhere.herokuapp.com/';

export function getProxyfiedUrl(originalUrl) {
    return PROXY_BASE_URL + originalUrl;
}
