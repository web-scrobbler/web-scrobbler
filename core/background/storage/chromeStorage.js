'use strict';

define([
	'wrappers/chrome', 'storage/wrapper'
], function(chrome, StorageWrapper) {
	const LOCAL = 0;
	const SYNC = 1;

	const CONNECTORS_OPTIONS = 'Connectors';
	const CUSTOM_PATTERNS = 'customPatterns';
	const LOCAL_CACHE = 'LocalCache';
	const OPTIONS = 'Options';
	const CORE = 'Core';

	const storageTypeMap = {};

	storageTypeMap[CONNECTORS_OPTIONS] = LOCAL;
	storageTypeMap[CUSTOM_PATTERNS] = LOCAL;
	storageTypeMap[LOCAL_CACHE] = LOCAL;
	storageTypeMap[OPTIONS] = LOCAL;
	storageTypeMap[CORE] = LOCAL;

	/**
	 * Return storage by given namespace according storage type map.
	 * @param  {String} namespace Storage namespace
	 * @return {Object} StorageWrapper instance
	 * @throws {Error} if unknown namespace is specified
	 */
	function getStorage(namespace) {
		let storageType = storageTypeMap[namespace];
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
		let storageArea = chrome.storage.local;
		return new StorageWrapper(storageArea, namespace);
	}

	/**
	 * Return sync storage wrapped into StorageWrapper object.
	 * Local storage is used as fallback.
	 * @param  {String} namespace Scrobbler storage namespace
	 * @return {Object} StorageWrapper instance
	 */
	function getSyncStorage(namespace) {
		let storageArea = chrome.storage.sync || chrome.storage.local;
		return new StorageWrapper(storageArea, namespace);
	}

	/**
	 * Object that helps to get wrapped storage.
	 */
	return {
		getStorage, getScrobblerStorage,

		getLocalStorage, getSyncStorage,

		CONNECTORS_OPTIONS, CUSTOM_PATTERNS, LOCAL_CACHE, OPTIONS, CORE
	};
});
