'use strict';

/**
 * The pipeline stage applies custom song info data to given song info.
 * Plus, it saves the song info to Chrome storage.
 */

define((require) => {
	const ChromeStorage = require('storage/chromeStorage');

	const storage = ChromeStorage.getStorage(ChromeStorage.LOCAL_CACHE);
	const fieldMap = {
		'artist': 'userArtist',
		'track': 'userTrack',
		'album': 'userAlbum'
	};

	/**
	 * Save custom song info to Chrome storage.
	 * @param  {Object} song Song instance
	 * @return {Promise} Promise resolved when data is saved
	 */
	function saveSongMetadataToStorage(song) {
		let songId = song.getUniqueId();
		if (!songId) {
			return;
		}

		return storage.get().then((chromeData) => {
			let isChanged = false;

			if (!chromeData[songId]) {
				chromeData[songId] = {};
			}

			for (let field in fieldMap) {
				let userField = fieldMap[field];
				if (song.metadata.attr(userField)) {
					chromeData[songId][field] = song.metadata.attr(userField);
					isChanged = true;
				}
			}

			if (isChanged) {
				return storage.set(chromeData);
			}
		});
	}

	/**
	 * Fill song info by user defined values.
	 * @param  {Object} song Song instance
	 * @return {Promise} Promise that will be resolved then the task will complete
	 */
	function process(song) {
		let isChanged = false;

		// currently just transforms user data from metadata to processed data,
		// which makes it source data for next pipeline steps
		for (let field in fieldMap) {
			let userField = fieldMap[field];
			if (song.metadata.attr(userField)) {
				song.processed.attr(field, song.metadata.attr(userField));
				isChanged = true;
			}
		}

		if (isChanged) {
			song.flags.attr('isCorrectedByUser', true);
			return saveSongMetadataToStorage(song);
		}

		return Promise.resolve();
	}

	return { process };
});
