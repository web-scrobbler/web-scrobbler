'use strict';

define((require) => {
	const Util = require('util/util');

	/**
	 * StorageArea wrapper that supports for namespaces.
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
		 * @return {Object} Storage data
		 */
		async get() {
			const data = await this.storage.get();
			if (data && data.hasOwnProperty(this.namespace)) {
				return data[this.namespace];
			}

			return {};
		}

		/**
		 * Save data to storage.
		 * @param  {Object} data Data to save
		 */
		async set(data) {
			let dataToSave = {};
			dataToSave[this.namespace] = data;

			await this.storage.set(dataToSave);
		}

		/**
		 * Extend saved data by given one.
		 * @param  {Object} data Data to add
		 */
		async update(data) {
			const storageData = await this.get();
			const dataToSave = Object.assign(storageData, data);

			await this.set(dataToSave);
		}

		/**
		 * Log storage data to console output.
		 */
		async debugLog() {
			const data = await this.get();

			let text = JSON.stringify(data, null, 2);
			// Hide 'token' and 'sessionID' values if available
			text = Util.hideStringInText(data.token, text);
			text = Util.hideStringInText(data.sessionID, text);

			console.info(`storage.${this.namespace} = ${text}`);
		}

		/**
		 * Clear storage.
		 */
		async clear() {
			await this.storage.remove(this.namespace);
		}
	}

	return StorageWrapper;
});
