import BrowserStorage from '@/background/storage/browser-storage';
import SavedEditsModel from '@/background/storage/saved-edits.model';

export default new (class extends SavedEditsModel {
	/** @override */
	getStorage() {
		return BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);
	}
})();
