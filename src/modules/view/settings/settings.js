import { LightningElement, track } from 'lwc';

const REPO_URL = 'https://github.com/pmdartus/rcast';
const VERSION_INFO = {
    commitHash: process.env.COMMIT_HASH,
    releaseDate: new Intl.DateTimeFormat('en-US').format(new Date(process.env.RELEASE_DATE)),
};

// https://developers.google.com/web/updates/2017/08/estimating-available-storage-space#the-present
function estimateStorage() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        return navigator.storage.estimate();
    }

    if ('webkitTemporaryStorage' in navigator && 'queryUsageAndQuota' in navigator.webkitTemporaryStorage) {
        return new Promise((resolve, reject) => {
            navigator.webkitTemporaryStorage.queryUsageAndQuota(function(usage, quota) {
                resolve({ usage: usage, quota: quota });
            }, reject);
        });
    }

    return Promise.resolve({ usage: NaN, quota: NaN });
}

async function getStorageInfo() {
    try {
        const { usage, quota } = await estimateStorage();
        return {
            percentUsed: Math.round((usage / quota) * 100),
            usageInMB: Math.round(usage / (1024 * 1024)),
            quotaInMB: Math.round(quota / (1024 * 1024)),
        };
    } catch {
        return undefined;
    }
}

async function cleanUp(options = {}) {
    const { localStorage = false, cache = false, serviceWorker = false } = options;

    if (localStorage) {
        window.localStorage.clear();
    }

    if (cache) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(name => caches.delete(name)));
    }

    if (serviceWorker) {
        const swRegistrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(swRegistrations.map(swRegistration => swRegistration.unregister()));
    }
}

export default class Settings extends LightningElement {
    repoUrl = REPO_URL;
    versionInfo = VERSION_INFO;

    @track loading = true;
    @track storageInfo;

    async connectedCallback() {
        this.storageInfo = await getStorageInfo();
        this.loading = false;
    }

    get commitLink() {
        return `${REPO_URL}/tree/${VERSION_INFO.commitHash}`;
    }

    async handleCacheCleanup() {
        await cleanUp({ cache: true });
        window.location.reload();
    }

    async handleFullCleanup() {
        if (confirm('All the user preferences will be lost!')) {
            await cleanUp({ localStorage: true, cache: true, serviceWorker: true });
            window.location.reload();
        }
    }
}
