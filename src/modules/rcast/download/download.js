import { fetchEpisode, getPlaybackUrl, getProxyfiedUrl } from 'rcast/api';
import { swRegistration } from 'sw/window';

export const BG_FETCH_ID_PREFIX = 'episode:';

async function getExpectedResponseSize(url) {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
        });

        const contentLength = response.headers.get('content-length');
        return parseInt(contentLength, 10);
    } catch {
        return NaN;
    }
}

export function getFetchId(episodeId) {
    return `${BG_FETCH_ID_PREFIX}${episodeId}`;
}

export function getEpisodeDownloadUrl(episodeId) {
    return getProxyfiedUrl(getPlaybackUrl(episodeId));
}

export async function isEpisodeOffline(episodeId) {
    const match = await caches.match(getEpisodeDownloadUrl(episodeId));
    return Boolean(match);
}

export async function downloadEpisode(episodeId) {
    const swReg = await swRegistration;

    const fetchId = getFetchId(episodeId);
    const downloadUrl = getEpisodeDownloadUrl(episodeId);

    // Return the existing registration if there is a background fetch in progress. Otherwise
    // register a new background fetch.
    const existingFetchRegistration = await swReg.backgroundFetch.get(fetchId);
    if (existingFetchRegistration) {
        return existingFetchRegistration;
    }

    const [episodeResponse, expectedAudioResponseSize] = await Promise.all([
        fetchEpisode(episodeId),
        getExpectedResponseSize(downloadUrl),
    ]);

    const { episode } = episodeResponse.response;
    return swReg.backgroundFetch.fetch(fetchId, [downloadUrl], {
        title: episode.title,
        icons: [
            {
                sizes: '160x160',
                src: episode.image_url,
                type: 'image/jpeg',
            },
        ],
        downloadTotal: Number.isNaN(expectedAudioResponseSize) ? undefined : expectedAudioResponseSize,
    });
}

export function removeDownloadedEpisode(episodeId) {
    return caches.delete(getEpisodeDownloadUrl(episodeId));
}
