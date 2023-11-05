import * as BrowserStorage from '@/core/storage/browser-storage';
import SavedEditsModel from '@/core/storage/saved-edits.model';
import { SavedEdit } from '@/core/storage/options';
import StorageWrapper, { DataModels } from '@/core/storage/wrapper';

type K = typeof BrowserStorage.LOCAL_CACHE;
type V = DataModels[K];
type T = Record<K, V>;

class SavedEditsImpl extends SavedEditsModel {
	private songInfoStorage = BrowserStorage.getStorage<K>(
		BrowserStorage.LOCAL_CACHE,
	);

	public init() {
		this._init(BrowserStorage.getLocalStorage(BrowserStorage.LOCAL_CACHE));

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
		return BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);
	}
}

export default new SavedEditsImpl();
