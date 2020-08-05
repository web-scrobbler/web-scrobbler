import { BrowserStorage } from '@/background/storage/browser-storage';
import { CustomStorage } from '@/background/storage/custom-storage';
import { StorageWrapper } from '@/background/storage/storage-wrapper';

export const CustomPatterns = new (class extends CustomStorage {
	/** @override */
	getStorage(): StorageWrapper {
		return BrowserStorage.getStorage(BrowserStorage.CUSTOM_PATTERNS);
	}
})();
