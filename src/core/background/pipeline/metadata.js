'use strict';

/**
 * This pipeline stage loads song info from external services.
 */

define((require) => {
	const ChromeStorage = require('storage/chrome-storage');
	const ScrobbleService = require('service/scrobble-service');

	const options = ChromeStorage.getStorage(ChromeStorage.OPTIONS);

	const infoToCopy = [
		'duration', 'artist', 'track'
	];
	const metadataToCopy = [
		'artistThumbUrl', 'artistUrl', 'trackUrl', 'albumUrl'
	];

	/**
	 * Load song info using ScrobblerService object.
	 * @param  {Object} song Song instance
	 * @return {Promise} Promise resolved when task has complete
	 */
	function process(song) {
		if (song.isEmpty()) {
			return Promise.resolve(false);
		}

		return ScrobbleService.getSongInfo(song).then((songInfoArr) => {
			for (let field of metadataToCopy) {
				delete song.metadata[field];
			}

			let songInfo = getInfo(songInfoArr);
			let isSongValid = songInfo !== null;
			if (isSongValid) {
				for (let field of infoToCopy) {
					song.processed[field] = songInfo[field];
				}
				for (let field of metadataToCopy) {
					song.metadata[field] = songInfo[field];
				}
				if (!song.getAlbum()) {
					song.processed.album = songInfo.album;
				}
			}

			return options.get().then((data) => {
				song.flags.isValid = isSongValid || data.forceRecognize;
			});
		});
	}

	/**
	 * Get song info from array contains the highest keys count.
	 * @param  {Array} songInfoArr Array of song info objects
	 * @return {Object} Song info object
	 */
	function getInfo(songInfoArr) {
		return songInfoArr.reduce((prev, current) => {
			if (!current) {
				return prev;
			}
			if (!prev) {
				return current;
			}
			if (getNonEmptyKeyCount(current) > getNonEmptyKeyCount(prev)) {
				return current;
			}

			return prev;
		}, null);
	}

	/**
	 * Return number of non-empty object keys.
	 * @param  {Object} obj Object instance
	 * @return {Number} Number of non-empty object keys
	 */
	function getNonEmptyKeyCount(obj) {
		let keyCount = 0;
		for (let key in obj) {
			if (obj[key]) {
				++keyCount;
			}
		}

		return keyCount;
	}

	return { process };
});
