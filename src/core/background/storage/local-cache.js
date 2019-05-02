'use strict';

define((require) => {
	const Song = require('object/song');
	const ChromeStorage = require('storage/chrome-storage');

	const storage = ChromeStorage.getStorage(ChromeStorage.LOCAL_CACHE);

	async function fillSongData(song) {
		let songId = song.getUniqueId();
		if (!songId) {
			return false;
		}

		let data = await storage.get();
		if (data[songId]) {
			let isChanged = false;
			let savedMetadata = data[songId];

			for (let field of Song.USER_FIELDS) {
				if (savedMetadata[field]) {
					isChanged = true;
					song.processed[field] = savedMetadata[field];
				}
			}

			return isChanged;
		}

		return false;
	}

	/**
	 * Save custom song info to Chrome storage.
	 * @param  {Object} song Song instance
	 * @param  {Object} data User data
	 */
	async function saveSongData(song, data) {
		let songId = song.getUniqueId();
		if (!songId) {
			return;
		}

		let chromeData = await storage.get();
		let isChanged = false;

		if (!chromeData[songId]) {
			chromeData[songId] = {};
		}

		for (let field of Song.USER_FIELDS) {
			if (data[field]) {
				chromeData[songId][field] = data[field];
				isChanged = true;
			}
		}

		if (isChanged) {
			await storage.set(chromeData);
		}
	}

	/**
	 * Remove song info from Chrome storage.
	 * @param  {Object} song Song object
	 */
	async function removeSongData(song) {
		let songId = song.getUniqueId();
		if (!songId) {
			return;
		}

		let data = await storage.get();

		delete data[songId];
		await storage.set(data);
	}

	return {
		fillSongData, removeSongData, saveSongData
	};
});
