'use strict';

/**
 * The module manages URL patterns can be defined by users.
 */
define((require) => {
	const BrowserStorage = require('storage/browser-storage');
	const CustomStorage = require('storage/custom-storage');

	class CustomPatterns extends CustomStorage {
		/** @override */
		getStorage() {
			return BrowserStorage.getStorage(BrowserStorage.CUSTOM_PATTERNS);
		}
	}

	return new CustomPatterns();
});
