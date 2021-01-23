import { LightningElement, api, track } from 'lwc';

import { workbox } from 'sw/window';

const REPO_URL = 'https://github.com/pmdartus/rcast';
const VERSION_INFO = {
    commitHash: process.env.COMMIT_HASH,
    releaseDate: new Intl.DateTimeFormat('en-US').format(new Date(process.env.RELEASE_DATE)),
};

async function getStorageInfo() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
            const { usage, quota } = await navigator.storage.estimate();
            return {
                percentUsed: Math.round((usage / quota) * 100),
                usageInMB: Math.round(usage / (1024 * 1024)),
                quotaInMB: Math.round(quota / (1024 * 1024)),
            };
        } catch {
            // Do nothing
        }
    }

    return undefined;
}

async function cleanUp(options = {}) {
    const { localStorage = false, cache = false, serviceWorkers = false } = options;

    if (localStorage) {
        window.localStorage.clear();
    }

    if (cache) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((name) => caches.delete(name)));
    }

    if (serviceWorkers) {
        const swRegistrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(swRegistrations.map((swRegistration) => swRegistration.unregister()));
    }
}

export default class Settings extends LightningElement {
    @api props;

    @track loading = true;
    @track storageInfo;

    repoUrl = REPO_URL;
    versionInfo = VERSION_INFO;

    async connectedCallback() {
        this.storageInfo = await getStorageInfo();
        this.loading = false;
    }

    get commitLink() {
        return `${REPO_URL}/tree/${VERSION_INFO.commitHash}`;
    }

    async handleCheckForUpdates() {
        const message = workbox ? 'Checking for updates...' : 'No updates found.';

        window.dispatchEvent(
            new CustomEvent('show-toast', {
                detail: {
                    message,
                    duration: 3000, // 3 seconds
                },
            }),
        );

        if (workbox) {
            // The update method asynchronously checks if a new service worker is available (doing
            // byte-to-byte comparison). If a new service worker is available the "updatefound"
            // event will be fired. Otherwise nothing will happen.
            // It would be great to have know if no updates are available to report that back to
            // the user.
            workbox.update();
        }
    }

    async handleCacheCleanup() {
        await cleanUp({ cache: true, serviceWorkers: true });
        window.location.reload();
    }

    async handleFullCleanup() {
        if (confirm('All the user preferences will be lost!')) {
            await cleanUp({ localStorage: true, cache: true, serviceWorkers: true });
            window.location.reload();
        }
    }
}
