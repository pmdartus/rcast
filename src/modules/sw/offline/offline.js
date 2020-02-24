import { API_CACHE_NAME, EPISODES_CACHE_NAME } from 'sw/shared';

/**
 * Returns a list of all the episode ids that are available offline. An episode is considered
 * offline if both the episode API response and the file are in the cache.
 */
export async function getOfflineEpisodes() {
    if (!('caches' in window)) {
        return [];
    }

    // Those caches are created on demand when the service worker store an API response or download
    // an episode. We need to check fist if the caches have been created.
    const [hasApiCache, hasEpisodeCache] = await Promise.all([
        caches.has(API_CACHE_NAME),
        caches.has(EPISODES_CACHE_NAME),
    ]);

    if (!hasApiCache || !hasEpisodeCache) {
        return [];
    }

    const [apiCache, episodeCache] = await Promise.all([caches.open(API_CACHE_NAME), caches.open(EPISODES_CACHE_NAME)]);
    const [apiResponses, episodeResponses] = await Promise.all([apiCache.keys(), episodeCache.keys()]);

    return episodeResponses
        .map(response => {
            const [url, id] = response.url.match(/https:\/\/api.spreaker.com\/v2\/episodes\/(\d+)/);
            return { url, id };
        })
        .filter(episode => apiResponses.some(response => response.url === episode.url))
        .map(episode => episode.id);
}
