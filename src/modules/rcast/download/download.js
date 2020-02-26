import { fetchEpisode, getPlaybackUrl, getProxyfiedUrl } from 'rcast/api';
import { swRegistration } from 'sw/window';

const BG_FETCH_ID_PREFIX = 'episode:';

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

export async function isEpisodeOffline(episodeId) {
    const cachedUrl = getProxyfiedUrl(getPlaybackUrl(episodeId));
    const match = await caches.match(cachedUrl);
    return Boolean(match);
}

export async function downloadEpisode(episodeId) {
    const swReg = await swRegistration;

    const fetchId = `${BG_FETCH_ID_PREFIX}${episodeId}`;
    const episodeAudioUrl = getProxyfiedUrl(getPlaybackUrl(episodeId));

    // Return the existing registration if there is a background fetch in progress. Otherwise
    // register a new background fetch.
    const existingFetchRegistration = swReg.backgroundFetch.get(fetchId);
    if (existingFetchRegistration) {
        return existingFetchRegistration;
    }

    const [episodeResponse, expectedAudioResponseSize] = await Promise.all([
        fetchEpisode(episodeId),
        getExpectedResponseSize(episodeAudioUrl),
    ]);

    const { episode } = episodeResponse.response;
    return swReg.backgroundFetch.fetch(fetchId, [episodeAudioUrl], {
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
