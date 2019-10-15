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
		 * @param {String} connectorId Connector ID
		 * @param {Array} patterns Array of custom URL patterns
		 */
		async setPatterns(connectorId, patterns) {
			let data = await storage.get();

			data[connectorId] = patterns;
			await storage.set(data);
		},

		/**
		 * Remove custom URL patterns for given connector.
		 * @param {String} connectorId Connector ID
		 */
		async resetPatterns(connectorId) {
			let data = await storage.get();

			delete data[connectorId];
			await storage.set(data);
		}
	};
});
