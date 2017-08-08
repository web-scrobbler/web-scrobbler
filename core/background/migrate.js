'use strict';

/**
 * Module that contains all migrate code.
 */

define(['storage/chromeStorage'], (ChromeStorage) => {
	/**
	 * Migrate from LocalStorage to ChromeStorage.
	 * @return {Promise} Promise that will be resolved when the task has complete
	 */
	function migrateFromLocalStorage() {
		let options = ChromeStorage.getStorage(ChromeStorage.OPTIONS);
		let defaultOptions = [
			'disableGa', 'forceRecognize', 'useNotifications',
			'useUnrecognizedSongNotifications',
		];

		return options.get().then((data) => {
			if (!localStorage.length) {
				return;
			}

			console.log('Convert options');

			for (let option of defaultOptions) {
				if (localStorage[option] !== undefined) {
					data[option] = localStorage[option] === '1';
				}

			}
			data.disabledConnectors = JSON.parse(localStorage.disabledConnectors);

			return options.set(data).then(() => {
				localStorage.clear();
			});
		});
	}

	/**
	 * Perform a migration.
	 * @return {Promise} Promise that will be resolved when the task has complete
	 */
	function migrate() {
		return migrateFromLocalStorage();
	}

	return { migrate };
});
