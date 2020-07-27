import BrowserStorage from '@/background/storage/browser-storage';
import ScrobbleStorageModel from '@/background/storage/scrobble-storage.model';
import StorageWrapper from '@/background/storage//storage-wrapper';

export default new (class extends ScrobbleStorageModel {
	/** @override */
	getStorage(): StorageWrapper {
		return BrowserStorage.getStorage(BrowserStorage.SCROBBLE_STORAGE);
	}
})();
