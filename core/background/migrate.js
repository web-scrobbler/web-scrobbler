'use strict';

/**
 * Module that contains all migrate code.
 */

define((require) => {
	const ChromeStorage = require('storage/chromeStorage');

	/**
	 * Migrate from LocalStorage to ChromeStorage.
	 * @return {Promise} Promise that will be resolved when the task has complete
	 */
	function migrateFromLocalStorage() {
		if (!localStorage.length) {
			return Promise.resolve();
		}

		let options = ChromeStorage.getStorage(ChromeStorage.OPTIONS);
		let defaultOptions = [
			'disableGa', 'forceRecognize', 'useNotifications',
			'useUnrecognizedSongNotifications',
		];

		return options.get().then((data) => {
			for (let option of defaultOptions) {
				if (localStorage[option] !== undefined) {
					data[option] = localStorage[option] === '1';
				}

			}
			data.disabledConnectors = JSON.parse(localStorage.disabledConnectors);

			return options.set(data).then(() => {
				localStorage.clear();
			}).then(() => {
				console.log('Converted "Options" storage');
			});
		});
	}

	/**
	 * Migrate from `chrome.storage.local` to `chrome.storage.sync`;
	 * @return {Promise} Promise resolved when the task has complete
	 */
	function migrateFromLocalToSync() {
		let namespaces = [
			ChromeStorage.CONNECTORS_OPTIONS,
			ChromeStorage.CUSTOM_PATTERNS
		];
		let promises = namespaces.map((namespace) => {
			let localStorage = ChromeStorage.getLocalStorage(namespace);
			let syncStorage = ChromeStorage.getSyncStorage(namespace);

			return localStorage.get().then((data) => {
				if (!Object.keys(data).length) {
					return;
				}

				return syncStorage.set(data).then(() => {
					return localStorage.clear();
				}).then(() => {
					console.log(`Converted "${namespace}" storage`);
				});
			});
		});

		return Promise.all(promises);
	}

	/**
	 * Perform a migration.
	 * @return {Promise} Promise that will be resolved when the task has complete
	 */
	function migrate() {
		return Promise.all([
			migrateFromLocalStorage(),
			migrateFromLocalToSync(),
		]);
	}

	return { migrate };
});
