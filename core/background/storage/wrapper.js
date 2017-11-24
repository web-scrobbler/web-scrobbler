'use strict';

define((require) => {
	const chrome = require('wrappers/chrome');
	const Util = require('util');

	/**
	 * Chrome StorageArea wrapper that supports for namespaces.
	 */
	class StorageWrapper {
		/**
		 * @param  {StorageArea} storage StorageArea object
		 * @param  {String} namespace Storage namespace
		 */
		constructor(storage, namespace) {
			this.storage = storage;
			this.namespace = namespace;
		}

		/**
		 * Read data from storage.
		 * @param  {String} key Key to get
		 * @return {Promise} Promise this will resolve when the task will complete
		 */
		get() {
			return new Promise((resolve, reject) => {
				this.storage.get((data) => {
					if (chrome.runtime.lastError) {
						console.error(`StorageWrapper#get: ${chrome.runtime.lastError}`);
						reject(chrome.runtime.lastError);
						return;
					}

					if (data && data.hasOwnProperty(this.namespace)) {
						resolve(data[this.namespace]);
					} else {
						resolve({});
					}
				});
			});
		}

		/**
		 * Save data to storage.
		 * @param  {Object} data Data to save
		 * @return {Promise} Promise this will resolve when the task will complete
		 */
		set(data) {
			return new Promise((resolve, reject) => {
				let dataToSave = {};
				dataToSave[this.namespace] = data;

				this.storage.set(dataToSave, () => {
					if (chrome.runtime.lastError) {
						console.error(`StorageWrapper#set: ${chrome.runtime.lastError}`);
						reject(chrome.runtime.lastError);
						return;
					}

					resolve();
				});
			});
		}

		/**
		 * Log storage data to console output.
		 */
		debugLog() {
			this.get().then((data) => {
				let text = JSON.stringify(data, null, 2);
				// Hide 'token' and 'sessionID' values if available
				text = Util.hideStringInText(data.token, text);
				text = Util.hideStringInText(data.sessionID, text);

				console.info(`chrome.storage.${this.namespace} = ${text}`);
			});
		}

		/**
		 * Clear storage.
		 * @return {Promise} Promise this will resolve when the task will complete
		 */
		clear() {
			return new Promise((resolve, reject) => {
				this.storage.remove(this.namespace, () => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
						return;
					}

					resolve();
				});
			});
		}
	}

	return StorageWrapper;
});
