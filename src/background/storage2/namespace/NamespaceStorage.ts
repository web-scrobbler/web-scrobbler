import { Storage as BrowserStorage } from 'webextension-polyfill-ts';

import { Storage } from '@/background/storage2/Storage';

/**
 * Storage implementation that wraps `chrome.storage.StorageArea`.
 *
 * This storage supports namespaces.
 */
export class NamespaceStorage<D> implements Storage<D> {
	private storage: BrowserStorage.StorageArea;
	private namespace: string;

	/**
	 * @param storage StorageArea object
	 * @param namespace Storage namespace
	 */
	constructor(storage: BrowserStorage.StorageArea, namespace: string) {
		this.storage = storage;
		this.namespace = namespace;
	}

	async get(): Promise<D> {
		const data = await this.storage.get();
		if (data && this.namespace in data) {
			return data[this.namespace] as D;
		}

		return {} as D;
	}

	async set(data: D): Promise<void> {
		const dataToSave = {};
		dataToSave[this.namespace] = data;

		await this.storage.set(dataToSave);
	}

	async update(data: Partial<D>): Promise<void> {
		const storageData = await this.get();
		const dataToSave = Object.assign(storageData, data);

		await this.set(dataToSave);
	}

	async clear(): Promise<void> {
		await this.storage.remove(this.namespace);
	}
}
