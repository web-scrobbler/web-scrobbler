import { Storage } from '@/background/storage3/Storage';
import { Storage as BrowserStorage } from 'webextension-polyfill-ts';

/**
 * Storage implementation that wraps `chrome.storage.StorageArea`.
 *
 * This storage supports namespaces, and holds storage data in memory to
 * provide synchronous access.
 */
export class NamespaceStorage<D> implements Storage<D> {
	/**
	 * @param storage StorageArea object
	 * @param data Initial storage data
	 * @param namespace Storage namespace
	 */
	constructor(
		private storage: BrowserStorage.StorageArea,
		private data: D,
		private namespace: string
	) {
		if (!namespace) {
			throw new Error('Storage namespace must not be empty!');
		}
	}

	get(): D {
		return this.data;
	}

	set(data: D): void {
		this.data = data;
		this.storage.set({ [this.namespace]: data });
	}

	update(data: Partial<D>): void {
		this.data = Object.assign({}, this.data, data);
		this.storage.set({ [this.namespace]: data });
	}

	clear(): void {
		this.data = {} as D;
		this.storage.remove(this.namespace);
	}
}
