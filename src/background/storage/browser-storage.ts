import { browser } from 'webextension-polyfill-ts';

import { StorageWrapper } from '@/background/storage/storage-wrapper';

type StorageType = 'local' | 'sync';

/**
 * This storage contains the options values.
 * @see DEFAULT_CONNECTOR_OPTIONS_MAP object in `config` module.
 */
const CONNECTORS_OPTIONS = 'Connectors';

/**
 * This storage contains custom URL patterns defined by an user.
 *
 * The format of storage data is following:
 * {
 *     connector_id: [URL_pattern_1, URL_pattern_2, ...],
 *     ...
 * }
 */
const CUSTOM_PATTERNS = 'customPatterns';

/**
 * This storage contains data used to manage notifications.
 *
 * The `changelog` section contains data is used to check
 * if user notified of changelog of certain version.
 *
 * The format of storage data is following:
 * {
 *     changelog: {
 *     	   // `ver` is the extention version, e.g. 'v2.15.1'
 *     	   // `true` means the notification of the version changelog
 *     	   // was displayed.
 *         ver: true,
 *         ...
 *     }
 * }
 */
const NOTIFICATIONS = 'Notifications';

/**
 * This storage contains the song data saved by an user.
 * The format of storage data is following:
 * {
 *     song_id: {
 *         artist: 'Artist name',
 *         track: 'Track name',
 *         album: 'Album name', // Optional property
 *     },
 *     ...
 * }
 */
const LOCAL_CACHE = 'LocalCache';

/**
 * This storage contains the options values.
 * @see DEFAULT_OPTIONS_MAP object in `config` module.
 */
const OPTIONS = 'Options';

/**
 * This storage contains the data saved and used by the extension core.
 * The format of storage data is following:
 * {
 *     appVersion: 'Extension version',
 * }
 */
const CORE = 'Core';

const SCROBBLE_STORAGE = 'ScrobbleStorage';

const storageTypeMap: Record<string, StorageType> = {
	[CONNECTORS_OPTIONS]: 'sync',
	[CUSTOM_PATTERNS]: 'sync',
	[NOTIFICATIONS]: 'sync',
	[OPTIONS]: 'sync',

	[SCROBBLE_STORAGE]: 'local',
	[LOCAL_CACHE]: 'local',
	[CORE]: 'local',
};

/**
 * Return storage by given namespace according storage type map.
 *
 * @param namespace Storage namespace
 *
 * @return StorageWrapper instance
 *
 * @throws {Error} if unknown namespace is specified
 */
function getStorage(namespace: string): StorageWrapper {
	const storageType = storageTypeMap[namespace];
	switch (storageType) {
		case 'sync':
			return getSyncStorage(namespace);
		case 'local':
			return getLocalStorage(namespace);
		default:
			throw new Error(`Unknown storage namespace: ${namespace}`);
	}
}

/**
 * Return storage by given scrobbler storage namespace.
 *
 * @param namespace Scrobbler storage namespace
 *
 * @return StorageWrapper instance
 */
function getScrobblerStorage(namespace: string): StorageWrapper {
	return getLocalStorage(namespace);
}

/**
 * Return local storage wrapped into StorageWrapper object.
 *
 * @param namespace Scrobbler storage namespace
 *
 * @return StorageWrapper instance
 */
function getLocalStorage(namespace: string): StorageWrapper {
	const storageArea = browser.storage.local;
	return new StorageWrapper(storageArea, namespace);
}

/**
 * Return sync storage wrapped into StorageWrapper object.
 * Local storage is used as fallback.
 *
 * @param namespace Scrobbler storage namespace
 *
 * @return StorageWrapper instance
 */
function getSyncStorage(namespace: string): StorageWrapper {
	const storageArea = browser.storage.sync || browser.storage.local;
	return new StorageWrapper(storageArea, namespace);
}

/**
 * Get the current amount of data stored in the local storage.
 */
function getLocalStorageUsage(): Promise<number> {
	// FIXME: Remove these comments once it's added to Firefox
	// @ts-ignore
	// eslint-disable-next-line
	return browser.storage.local.getBytesInUse(null);
}

/**
 * Get maximum amount in bytes of data can be stored in the local storage.
 */
function getLocalStorageSize(): number {
	return browser.storage.local.QUOTA_BYTES;
}

export const BrowserStorage = {
	getLocalStorage,
	getScrobblerStorage,
	getStorage,
	getSyncStorage,
	getLocalStorageUsage,
	getLocalStorageSize,

	CONNECTORS_OPTIONS,
	CORE,
	CUSTOM_PATTERNS,
	LOCAL_CACHE,
	NOTIFICATIONS,
	OPTIONS,
	SCROBBLE_STORAGE,
};
