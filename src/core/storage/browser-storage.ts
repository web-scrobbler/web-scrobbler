import browser from 'webextension-polyfill';
import StorageWrapper, { DataModels } from '@/core/storage/wrapper';

const LOCAL = 0;
const SYNC = 1;

export type StorageNamespace = keyof typeof storageTypeMap;

/**
 * This storage contains the connector options values.
 * @see DEFAULT_CONNECTOR_OPTIONS_MAP object in `config` module.
 */
export const CONNECTORS_OPTIONS = 'Connectors';

/**
 * This storage contains the connector override options values.
 * @see DEFAULT_CONNECTOR_OVERRIDE_OPTIONS_MAP object in `config` module.
 */
export const CONNECTORS_OVERRIDE_OPTIONS = 'ConnectorsOverrideOptions';

/**
 * This storage contains custom URL patterns defined by an user.
 *
 * The format of storage data is following:
 * \{
 *     connector_id: [URL_pattern_1, URL_pattern_2, ...],
 *     ...
 * \}
 */
export const CUSTOM_PATTERNS = 'customPatterns';

/**
 * This storage contains data used to manage notifications.
 *
 * The `changelog` section contains data is used to check
 * if user notified of changelog of certain version.
 *
 * The format of storage data is following:
 * \{
 *     changelog: \{
 *     	   // `ver` is the extention version, e.g. 'v2.15.1'
 *     	   // `true` means the notification of the version changelog
 *     	   // was displayed.
 *         ver: true,
 *         ...
 *     \}
 * \}
 */
export const NOTIFICATIONS = 'Notifications';

/**
 * This storage contains the song data saved by an user.
 * The format of storage data is following:
 * \{
 *     song_id: \{
 *         artist: 'Artist name',
 *         track: 'Track name',
 *         album: 'Album name', // Optional property
 *     \},
 *     ...
 * \}
 */
export const LOCAL_CACHE = 'LocalCache';

/**
 * This storage contains the options values.
 * @see DEFAULT_OPTIONS_MAP object in `config` module.
 */
export const OPTIONS = 'Options';

/**
 * This storage contains state management information for service worker
 */
export const STATE_MANAGEMENT = 'StateManagement';

/**
 * This storage contains the tabs for which scrobbling has been disabled
 */
export const DISABLED_TABS = 'DisabledTabs';

/**
 * This storage contains the regex/bulk edits saved by the user.
 * The format of storage data is following:
 * [
 *     ...,
 *     \{
 *         search: \{
 * 		       track: 'Track search regex or null',
 * 		       artist: 'Artist search regex or null',
 * 		       album: 'Album search regex or null',
 * 		       albumArtist: 'Album Artist search regex or null',
 * 	       \},
 * 	       replace: \{
 * 		       track: 'Track replace regex or null',
 * 		       artist: 'Artist replace regex or null',
 * 		       album: 'Album replace regex or null',
 * 		       albumArtist: 'Album Artist replace regex or null',
 * 	       \},
 *     \},
 *     ...
 * ]
 *
 * All non-null search properties must be true for the edit to be applied.
 * It will then apply all non-null replace properties where search is non-null.
 * The latest regex edit to match will be applied, assuming no local cache edits exist.
 */
export const REGEX_EDITS = 'RegexEdits';

/**
 * This storage contains the data saved and used by the extension core.
 * The format of storage data is following:
 * \{
 *     appVersion: 'Extension version',
 * \}
 */
export const CORE = 'Core';

const storageTypeMap = {
	[CONNECTORS_OPTIONS]: SYNC,
	[CONNECTORS_OVERRIDE_OPTIONS]: SYNC,
	[CUSTOM_PATTERNS]: SYNC,
	[NOTIFICATIONS]: SYNC,
	[OPTIONS]: SYNC,

	LastFM: LOCAL,
	LibreFM: LOCAL,
	ListenBrainz: LOCAL,
	Maloja: LOCAL,

	[LOCAL_CACHE]: LOCAL,
	[REGEX_EDITS]: LOCAL,
	[CORE]: LOCAL,
	[STATE_MANAGEMENT]: LOCAL,
	[DISABLED_TABS]: LOCAL,
};

/**
 * Return storage by given namespace according storage type map.
 * @param namespace - Storage namespace
 * @returns StorageWrapper instance
 * @throws if unknown namespace is specified
 */
export function getStorage<K extends StorageNamespace>(
	namespace: K
): StorageWrapper<K> {
	const storageType = storageTypeMap[namespace];
	switch (storageType) {
		case SYNC:
			return getSyncStorage(namespace);
		case LOCAL:
			return getLocalStorage(namespace);
		default:
			throw new Error(`Unknown storage namespace: ${namespace}`);
	}
}

/**
 * Return storage by given scrobbler storage namespace.
 * @param namespace - Scrobbler storage namespace
 * @returns StorageWrapper instance
 */
export function getScrobblerStorage<K extends keyof DataModels>(
	namespace: StorageNamespace
): StorageWrapper<K> {
	return getLocalStorage(namespace);
}

/**
 * Return local storage wrapped into StorageWrapper object.
 * @param namespace - Scrobbler storage namespace
 * @returns StorageWrapper instance
 */
export function getLocalStorage<K extends keyof DataModels>(
	namespace: StorageNamespace
): StorageWrapper<K> {
	const storageArea = browser.storage.local;
	return new StorageWrapper(storageArea, namespace);
}

/**
 * Return sync storage wrapped into StorageWrapper object.
 * Local storage is used as fallback.
 * @param namespace - Scrobbler storage namespace
 * @returns StorageWrapper instance
 */
export function getSyncStorage<K extends keyof DataModels>(
	namespace: StorageNamespace
): StorageWrapper<K> {
	const storageArea = browser.storage.sync || browser.storage.local;
	return new StorageWrapper(storageArea, namespace);
}
