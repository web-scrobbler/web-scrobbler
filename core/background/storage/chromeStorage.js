'use strict';

define([
	'wrappers/chrome', 'storage/wrapper'
], function(chrome, StorageWrapper) {
	/**
	 * Object that helps to get wrapped storage.
	 */
	return {
		/**
		 * Return local storage wrapped into StorageWrapper object.
		 * @return {Object} StorageWrapper instance.
		 */
		getLocalStorage(namespace) {
			let storageArea = chrome.storage.local;
			return new StorageWrapper(storageArea, namespace);
		},

		/**
		 * Return sync storage wrapped into StorageWrapper object.
		 * Local storage is used as fallback.
		 * @return {Object} StorageWrapper instance.
		 */
		getSyncStorage(namespace) {
			let storageArea = chrome.storage.sync || chrome.storage.local;
			return new StorageWrapper(storageArea, namespace);
		}
	};
});
