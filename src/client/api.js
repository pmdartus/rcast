// API documentation:
// https://github.com/eazyliving/fyyd-api

const API_BASE_URL = '/api/fyyd/0.2';

async function fetchFyyd(url) {
    const response = await fetch(API_BASE_URL + url);
    const res = await response.json();
    return res.data;
}

export function searchPodcasts({ term }) {
    return fetchFyyd(`/search/podcast?term=${term}`);
}

export function getPodcast({ podcastId }) {
    return fetchFyyd(`/podcast?podcast_id=${podcastId}`);
}

export function listEpisodes({ podcastId }) {
    return fetchFyyd(`/podcast/episodes?podcast_id=${podcastId}`);
}

export function getEpisode({ episodeId }) {
    return fetchFyyd(`/episode?episode_id=${episodeId}`);
}