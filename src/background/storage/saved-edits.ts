import { BrowserStorage } from '@/background/storage/browser-storage';
import { SavedEditsModel } from '@/background/storage/saved-edits.model';
import { Storage } from '@/background/storage2/Storage';

export const SavedEdits = new (class extends SavedEditsModel {
	/** @override */
	getStorage(): Storage<unknown> {
		return BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);
	}
})();
