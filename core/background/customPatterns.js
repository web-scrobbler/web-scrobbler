'use strict';

/**
 * The module manages URL patterns can be defined by users.
 */
define((require) => {
	const ChromeStorage = require('storage/chromeStorage');

	const storage = ChromeStorage.getStorage(ChromeStorage.CUSTOM_PATTERNS);

	return {
		/**
		 * Get custom patterns for all connectors.
		 * @return {Promise} Promise resolved with custom URL patterns
		 */
		getAllPatterns() {
			return storage.get();
		},

		/**
		 * Update custom patterns and save them to storage.
		 * @param {String} connector Connector label
		 * @param {Array} patterns Array of custom URL patterns
		 * @return {Promise} Promise resolved when patterns are saved
		 */
		setPatterns(connector, patterns) {
			return storage.get().then((data) => {
				data[connector] = patterns;
				return storage.set(data);
			});
		},

		/**
		 * Remove custom URL patterns for given connector.
		 * @param {String} connector Connector label
		 * @return {Promise} Promise resolved when patterns are reset
		 */
		resetPatterns(connector) {
			return storage.get().then((data) => {
				delete data[connector];
				return storage.set(data);
			});
		}
	};
});
