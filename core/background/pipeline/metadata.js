'use strict';

/**
 * This pipeline stage loads song info from external services.
 */

define((require) => {
	const can = require('wrappers/can');
	const ChromeStorage = require('storage/chromeStorage');
	const ScrobbleService = require('services/scrobbleService');

	const options = ChromeStorage.getStorage(ChromeStorage.OPTIONS);

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
			let songInfo = getInfo(songInfoArr);
			let isSongValid = songInfo !== null;
			if (isSongValid) {
				can.batch.start();

				song.processed.attr({
					duration: songInfo.duration,
					artist: songInfo.artist,
					track: songInfo.track
				});
				if (!song.getAlbum()) {
					song.processed.attr('album', songInfo.album);
				}

				song.metadata.attr({
					artistThumbUrl: songInfo.artistThumbUrl,
					artistUrl: songInfo.artistUrl,
					trackUrl: songInfo.trackUrl,
					albumUrl: songInfo.albumUrl
				});

				can.batch.stop();
			}

			return options.get().then((data) => {
				song.flags.attr('isValid', isSongValid || data.forceRecognize);
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
