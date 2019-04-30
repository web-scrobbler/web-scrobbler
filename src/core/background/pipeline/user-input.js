'use strict';

/**
 * The pipeline stage applies custom song info data to given song info.
 * Plus, it saves the song info to Chrome storage.
 */

define((require) => {
	const Song = require('object/song');
	const ChromeStorage = require('storage/chrome-storage');

	const storage = ChromeStorage.getStorage(ChromeStorage.LOCAL_CACHE);

	/**
	 * Save custom song info to Chrome storage.
	 * @param  {Object} song Song instance
	 */
	async function saveSongMetadataToStorage(song) {
		let songId = song.getUniqueId();
		if (!songId) {
			return;
		}

		let chromeData = await storage.get();
		let isChanged = false;

		if (!chromeData[songId]) {
			chromeData[songId] = {};
		}

		for (let field of Song.USER_FIEDS) {
			if (song.userdata[field]) {
				chromeData[songId][field] = song.userdata[field];
				isChanged = true;
			}
		}

		if (isChanged) {
			await storage.set(chromeData);
		}
	}

	/**
	 * Fill song info by user defined values.
	 * @param  {Object} song Song instance
	 */
	async function process(song) {
		let isChanged = false;

		/*
		 * Currently just transforms user data from metadata to processed data,
		 * which makes it source data for next pipeline steps.
		 */
		for (let field of Song.USER_FIEDS) {
			if (song.userdata[field]) {
				song.processed[field] = song.userdata[field];
				isChanged = true;
			}
		}

		if (isChanged) {
			song.flags.isCorrectedByUser = true;
			await saveSongMetadataToStorage(song);
		}
	}

	return { process };
});
