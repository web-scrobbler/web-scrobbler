import BrowserStorage from '@/background/storage/browser-storage';
import ScrobbleStorageModel from '@/background/storage/scrobble-storage.model';

export default new (class extends ScrobbleStorageModel {
	/** @override */
	getStorage() {
		return BrowserStorage.getStorage(BrowserStorage.SCROBBLE_STORAGE);
	}
})();
