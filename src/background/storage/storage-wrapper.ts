import { hideObjectValue } from '@/background/util/util';

import { Storage } from 'webextension-polyfill-ts';

/**
 * StorageArea wrapper that supports for namespaces.
 */
export class StorageWrapper {
	private storage: Storage.StorageArea;
	private namespace: string;

	/**
	 * @param storage StorageArea object
	 * @param namespace Storage namespace
	 */
	constructor(storage: Storage.StorageArea, namespace: string) {
		this.storage = storage;
		this.namespace = namespace;
	}

	/**
	 * Read data from storage.
	 *
	 * @return Storage data
	 */
	async get(): Promise<unknown> {
		const data = await this.storage.get();
		if (data && this.namespace in data) {
			return data[this.namespace] as unknown;
		}

		return {};
	}

	/**
	 * Save data to storage.
	 *
	 * @param data Data to save
	 */
	async set(data: unknown): Promise<void> {
		const dataToSave = {};
		dataToSave[this.namespace] = data;

		await this.storage.set(dataToSave);
	}

	/**
	 * Extend saved data by given one.
	 *
	 * @param data Data to add
	 */
	async update(data: unknown): Promise<void> {
		const storageData = await this.get();
		const dataToSave = Object.assign(storageData, data);

		await this.set(dataToSave);
	}

	/**
	 * Log storage data to console output.
	 *
	 * @param [hiddenKeys=[]] Array of keys should be hidden
	 */
	/* istanbul ignore next */
	async debugLog(hiddenKeys: string[] = []): Promise<void> {
		const data = await this.get();

		let hideSensitiveDataFn = null;
		if (hiddenKeys.length > 0) {
			hideSensitiveDataFn = (key: string, value: string) => {
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
	async clear(): Promise<void> {
		await this.storage.remove(this.namespace);
	}
}
