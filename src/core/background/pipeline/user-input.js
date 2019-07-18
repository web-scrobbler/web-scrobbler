'use strict';

/**
 * The pipeline stage applies custom song info data to given song info.
 * Plus, it saves the song info to browser storage.
 */

define((require) => {
	const LocalCacheStorage = require('storage/local-cache');

	/**
	 * Fill song info by user defined values.
	 * @param  {Object} song Song instance
	 */
	async function process(song) {
		if (await LocalCacheStorage.fillSongData(song)) {
			song.flags.isCorrectedByUser = true;
		}
	}

	return { process };
});
