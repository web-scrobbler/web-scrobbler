import { BrowserStorage } from '@/background/storage/browser-storage';
import { SavedEditsModel } from '@/background/storage/saved-edits.model';
import { StorageWrapper } from '@/background/storage/storage-wrapper';

export const SavedEdits = new (class extends SavedEditsModel {
	/** @override */
	getStorage(): StorageWrapper {
		return BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);
	}
})();
