import { hideObjectValue } from '@/background/util/util';

/**
 * StorageArea wrapper that supports for namespaces.
 */
export default class StorageWrapper {
	/**
	 * @param {Object} storage StorageArea object
	 * @param {String} namespace Storage namespace
	 */
	constructor(storage, namespace) {
		this.storage = storage;
		this.namespace = namespace;
	}

	/**
	 * Read data from storage.
	 *
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
	 *
	 * @param {Object} data Data to save
	 */
	async set(data) {
		const dataToSave = {};
		dataToSave[this.namespace] = data;

		await this.storage.set(dataToSave);
	}

	/**
	 * Extend saved data by given one.
	 *
	 * @param {Object} data Data to add
	 */
	async update(data) {
		const storageData = await this.get();
		const dataToSave = Object.assign(storageData, data);

		await this.set(dataToSave);
	}

	/**
	 * Log storage data to console output.
	 *
	 * @param {Object} [hiddenKeys=[]] Array of keys should be hidden
	 */
	/* istanbul ignore next */
	async debugLog(hiddenKeys = []) {
		const data = await this.get();

		let hideSensitiveDataFn = null;
		if (hiddenKeys.length > 0) {
			hideSensitiveDataFn = (key, value) => {
				if (hiddenKeys.includes(key)) {
					return hideObjectValue(value);
				}

				return value;
			};
		}

		const text = JSON.stringify(data, hideSensitiveDataFn, 2);
		console.info(`storage.${this.namespace} = ${text}`);
	}

	/**
	 * Clear storage.
	 */
	async clear() {
		await this.storage.remove(this.namespace);
	}
}
