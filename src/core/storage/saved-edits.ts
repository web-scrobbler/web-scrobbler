import { LOCAL_CACHE } from '@/core/storage/storage-constants';
import { getStorage, getLocalStorage } from '@/core/storage/browser-storage';
import SavedEditsModel from '@/core/storage/saved-edits.model';
import type { SavedEdit } from '@/core/storage/options';
import type { DataModels } from '@/core/storage/wrapper';
import type StorageWrapper from '@/core/storage/wrapper';

type K = typeof LOCAL_CACHE;
type V = DataModels[K];
type T = Record<K, V>;

class SavedEditsImpl extends SavedEditsModel {
	private songInfoStorage = getStorage<K>(LOCAL_CACHE);

	public init() {
		this._init(getLocalStorage(LOCAL_CACHE));

		// #v-ifdef VITE_DEV
		void this.songInfoStorage.debugLog();
		// #v-endif
	}

	/** @override */
	async clear(): Promise<void> {
		return await this.songInfoStorage.clear();
	}

	/** @override */
	async getSongInfoStorage(): Promise<Record<string, SavedEdit> | null> {
		return this.songInfoStorage.get();
	}

	/** @override */
	async saveSongInfoToStorage(data: T[K]): Promise<void> {
		return await this.songInfoStorage.set(data);
	}

	/** @override */
	getStorage(): StorageWrapper<K> {
		return getStorage(LOCAL_CACHE);
	}
}

export default new SavedEditsImpl();
