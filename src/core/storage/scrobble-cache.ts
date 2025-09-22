import { SCROBBLE_CACHE } from './storage-constants';
import type { CacheScrobble, DataModels } from './wrapper';
import type StorageWrapper from './wrapper';
import { getLocalStorage, getStorage } from './browser-storage';
import ScrobbleCacheModel from './scrobble-cache.model';

type K = typeof SCROBBLE_CACHE;
type V = DataModels[K];
type T = Record<K, V>;

class ScrobbleCacheImpl extends ScrobbleCacheModel {
	private scrobbleCacheStorage = this.getStorage();

	public init() {
		this._init(getLocalStorage(SCROBBLE_CACHE));

		// #v-ifdef VITE_DEV
		void this.scrobbleCacheStorage.debugLog();
		// #v-endif
	}

	/** @override */
	async getScrobbleCacheStorage(): Promise<CacheScrobble[] | null> {
		return this.scrobbleCacheStorage.get();
	}

	/** @override */
	async getScrobbleCacheStorageLocking(): Promise<CacheScrobble[] | null> {
		return this.scrobbleCacheStorage.getLocking();
	}

	/** @override */
	async saveScrobbleCacheToStorage(data: T[K]): Promise<void> {
		return await this.scrobbleCacheStorage.set(data);
	}

	/** @override */
	async saveScrobbleCacheToStorageLocking(data: T[K]): Promise<void> {
		return await this.scrobbleCacheStorage.setLocking(data);
	}

	/** @override */
	getStorage(): StorageWrapper<K> {
		return getStorage(SCROBBLE_CACHE);
	}
}

export default new ScrobbleCacheImpl();
