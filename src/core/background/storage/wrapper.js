'use strict';

define((require) => {
	const Util = require('util/util');

	/**
	 * StorageArea wrapper that supports for namespaces.
	 */
	class StorageWrapper {
		/**
		 * @param  {Object} storage StorageArea object
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
			if (data && this.namespace in data) {
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
		 * @param  {Object} hiddenKeys Array of keys should be hidden
		 */
		async debugLog(hiddenKeys = []) {
			const data = await this.get();

			for (let key of hiddenKeys) {
				if (key in data) {
					data[key] = Util.hideObjectValue(data[key]);
				}
			}

			const text = JSON.stringify(data, null, 2);
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
