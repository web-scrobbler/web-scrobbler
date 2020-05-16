'use strict';

define((require) => {
	const MD5 = require('md5');
	const Song = require('object/song');
	const BrowserStorage = require('storage/browser-storage');

	const storage = BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);

	async function fillSongData(song) {
		let songId = song.getUniqueId();
		if (!songId) {
			return false;
		}

		const data = await storage.get();

		// Handle cases where `albumArtist` support was added
		if (!(songId in data)) {
			songId = makeFallbackId(song, ['artist', 'track', 'album']);
		}

		// Handle cases where `album` support was added
		if (!(songId in data)) {
			songId = makeFallbackId(song, ['artist', 'track']);
		}

		if (songId in data) {
			const savedMetadata = data[songId];

			for (const field of Song.USER_FIELDS) {
				song.processed[field] = savedMetadata[field];
			}

			return true;
		}

		return false;
	}

	/**
	 * Save custom song info to browser storage.
	 * @param  {Object} song Song instance
	 * @param  {Object} data User data
	 */
	async function saveSongData(song, data) {
		const songId = song.getUniqueId();
		if (!songId) {
			return;
		}

		const storageData = await storage.get();

		if (!storageData[songId]) {
			storageData[songId] = {};
		}

		for (const field of Song.USER_FIELDS) {
			storageData[songId][field] = data[field];
		}

		await storage.set(storageData);
	}

	/**
	 * Remove song info from browser storage.
	 * @param  {Object} song Song object
	 */
	async function removeSongData(song) {
		const songId = song.getUniqueId();
		if (!songId) {
			return;
		}

		const data = await storage.get();

		delete data[songId];
		await storage.set(data);
	}

	function makeFallbackId(song, properties) {
		let inputStr = '';

		for (const field of properties) {
			if (song.parsed[field]) {
				inputStr += song.parsed[field];
			}
		}

		return MD5(inputStr);
	}

	return {
		fillSongData, removeSongData, saveSongData
	};
});
