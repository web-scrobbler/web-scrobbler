import BrowserStorage from '@/background/storage/browser-storage';
import CustomStorage from '@/background/storage/custom-storage';

export default new (class extends CustomStorage {
	/** @override */
	getStorage() {
		return BrowserStorage.getStorage(BrowserStorage.CUSTOM_PATTERNS);
	}
})();
