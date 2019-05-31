'use strict';

/**
 * The module manages URL patterns can be defined by users.
 */
define((require) => {
	const BrowserStorage = require('storage/browser-storage');

	const storage = BrowserStorage.getStorage(BrowserStorage.CUSTOM_PATTERNS);

	return {
		/**
		 * Get custom patterns for all connectors.
		 * @return {Object} Custom URL patterns
		 */
		getAllPatterns() {
			return storage.get();
		},

		/**
		 * Update custom patterns and save them to storage.
		 * @param {String} connector Connector label
		 * @param {Array} patterns Array of custom URL patterns
		 */
		async setPatterns(connector, patterns) {
			let data = await storage.get();

			data[connector] = patterns;
			await storage.set(data);
		},

		/**
		 * Remove custom URL patterns for given connector.
		 * @param {String} connector Connector label
		 */
		async resetPatterns(connector) {
			let data = await storage.get();

			delete data[connector];
			await storage.set(data);
		}
	};
});
