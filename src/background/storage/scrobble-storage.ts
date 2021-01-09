import { BrowserStorage } from '@/background/storage/browser-storage';
import { ScrobbleStorageModel } from '@/background/storage/scrobble-storage.model';
import { Storage } from '@/background/storage2/Storage';

export const ScrobbleStorage = new (class extends ScrobbleStorageModel {
	/** @override */
	getStorage(): Storage<unknown> {
		return BrowserStorage.getStorage(BrowserStorage.SCROBBLE_STORAGE);
	}
})();
