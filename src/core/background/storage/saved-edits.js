'use strict';

define((require) => {
	const BrowserStorage = require('storage/browser-storage');
	const SavedEditsModel = require('storage/saved-edits.model');

	class SavedEditsImpl extends SavedEditsModel {
		constructor() {
			super();

			this.songInfoStorage = BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);
			this.songInfoStorage.debugLog();
		}

		/** @override */
		async clear() {
			return await this.songInfoStorage.clear();
		}

		/** @override */
		async getSongInfoStorage() {
			return await this.songInfoStorage.get();
		}

		/** @override */
		async saveSongInfoToStorage(data) {
			return await this.songInfoStorage.set(data);
		}
	}

	return new SavedEditsImpl();
});
