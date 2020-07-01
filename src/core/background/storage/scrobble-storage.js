'use strict';

define((require) => {
	const BrowserStorage = require('storage/browser-storage');
	const ScrobbleStorageModel = require('storage/scrobble-storage.model');

	class ScrobbleStorageImpl extends ScrobbleStorageModel {
		/** @override */
		getStorage() {
			return BrowserStorage.getStorage(BrowserStorage.SCROBBLE_STORAGE);
		}
	}

	return new ScrobbleStorageImpl();
});
