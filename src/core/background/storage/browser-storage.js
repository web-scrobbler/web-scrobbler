'use strict';

define((require) => {
	const browser = require('webextension-polyfill');
	const StorageWrapper = require('storage/wrapper');

	const LOCAL = 0;
	const SYNC = 1;

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

	const storageTypeMap = {
		[CONNECTORS_OPTIONS]: SYNC,
		[CUSTOM_PATTERNS]: SYNC,
		[NOTIFICATIONS]: SYNC,
		[OPTIONS]: SYNC,

		[SCROBBLE_STORAGE]: LOCAL,
		[LOCAL_CACHE]: LOCAL,
		[CORE]: LOCAL,
	};

	/**
	 * Return storage by given namespace according storage type map.
	 * @param  {String} namespace Storage namespace
	 * @return {Object} StorageWrapper instance
	 * @throws {Error} if unknown namespace is specified
	 */
	function getStorage(namespace) {
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
	 * @param  {String} namespace Scrobbler storage namespace
	 * @return {Object} StorageWrapper instance
	 */
	function getScrobblerStorage(namespace) {
		return getLocalStorage(namespace);
	}

	/**
	 * Return local storage wrapped into StorageWrapper object.
	 * @param  {String} namespace Scrobbler storage namespace
	 * @return {Object} StorageWrapper instance
	 */
	function getLocalStorage(namespace) {
		const storageArea = browser.storage.local;
		return new StorageWrapper(storageArea, namespace);
	}

	/**
	 * Return sync storage wrapped into StorageWrapper object.
	 * Local storage is used as fallback.
	 * @param  {String} namespace Scrobbler storage namespace
	 * @return {Object} StorageWrapper instance
	 */
	function getSyncStorage(namespace) {
		const storageArea = browser.storage.sync || browser.storage.local;
		return new StorageWrapper(storageArea, namespace);
	}

	/**
	 * Object that helps to get wrapped storage.
	 */
	return {
		getStorage,
		getScrobblerStorage,
		getLocalStorage,
		getSyncStorage,

		CONNECTORS_OPTIONS,
		SCROBBLE_STORAGE,
		CUSTOM_PATTERNS,
		NOTIFICATIONS,
		LOCAL_CACHE,
		OPTIONS,
		CORE,
	};
});
