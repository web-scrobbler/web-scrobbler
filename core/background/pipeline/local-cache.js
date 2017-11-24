'use strict';

/**
 * This pipeline stage loads song info from Chrome storage
 * and apply it to given song. This module also provides
 * a function to remove song info from storage.
 */

define((require) => {
	const ChromeStorage = require('storage/chromeStorage');

	const storage = ChromeStorage.getStorage(ChromeStorage.LOCAL_CACHE);
	const fieldsToSave = ['artist', 'track', 'album'];

	/**
	 * Load song info from Chrome storage.
	 * @param  {Object} song Song object
	 * @return {Promise} Promise that will be resolved when the task has complete
	 */
	function process(song) {
		let songId = song.getUniqueId();
		if (!songId) {
			return Promise.resolve();
		}

		return storage.get().then((data) => {
			if (data[songId]) {
				let isChanged = false;
				let savedMetadata = data[songId];

				for (let field of fieldsToSave) {
					if (savedMetadata[field]) {
						isChanged = true;
						song.processed.attr(field, savedMetadata[field]);
					}
				}

				if (isChanged) {
					song.flags.attr('isCorrectedByUser', true);
				}
			}
		});
	}

	/**
	 * Remove song info from Chrome storage.
	 * @param  {Object} song Song object
	 * @return {Promise} Promise that will be resolved when the task has complete
	 */
	function removeSongFromStorage(song) {
		let songId = song.getUniqueId();
		if (!songId) {
			return Promise.resolve();
		}

		return storage.get().then((data) => {
			delete data[songId];
			return storage.set(data);
		});
	}

	return { process, removeSongFromStorage };
});
