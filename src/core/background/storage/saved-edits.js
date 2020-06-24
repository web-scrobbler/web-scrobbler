'use strict';

define((require) => {
	const BrowserStorage = require('storage/browser-storage');
	const SavedEditsModel = require('storage/saved-edits.model');

	class SavedEditsImpl extends SavedEditsModel {
		/** @override */
		getStorage() {
			return BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);
		}
	}

	return new SavedEditsImpl();
});
