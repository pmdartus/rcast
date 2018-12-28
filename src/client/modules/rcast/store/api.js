async function fetchJson(url) {
    const response = await fetch(url);
    const res = await response.json();

    if (!response.ok && res.error) {
        throw new Error(res.error.message);
    }

    return res;
}

export function getPodcast({ id }) {
    return fetchJson(`/api/1/podcasts/${id}`);
}

export function getTopPodcasts({ genreId }) {
    return fetchJson(`/api/1/top?genreId=${genreId}`);
}
