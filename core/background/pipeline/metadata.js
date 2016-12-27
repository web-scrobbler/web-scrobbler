'use strict';

define([
	'services/scrobbleService'
], function(ScrobbleService) {
	/**
	 * Get array of functions that return promises.
	 * Used for delayed promise execute.
	 * @param  {Object} song Song instance
	 * @return {Array} Array of promise factories
	 */
	function getLoadSongInfoFactories(song) {
		return ScrobbleService.getAllBound().filter((scrobbler) => {
			return scrobbler.isLoadSongInfoSupported();
		}).map((scrobbler) => {
			// Don't execute the promise immediately and return factory function
			return function() {
				return scrobbler.loadSongInfo(song);
			};
		});
	}

	/**
	 * Load song info using scrobblers API.
	 * @param  {Object} song Song instance
	 * @return {Promise} Promise that will be resolved then the first valid song info is fetched
	 */
	function loadSong(song) {
		let factories = getLoadSongInfoFactories(song);
		if (factories.length > 0) {
			let isSongInfoValid = false;
			let loadSongInfoSequence = Promise.resolve();

			// Queue promises
			factories.forEach((loadSongInfoFactory) => {
				loadSongInfoSequence = loadSongInfoSequence.then(() => {
					// Should be checked in runtime
					if (!isSongInfoValid) {
						let loadSongInfoPromise = loadSongInfoFactory();
						return loadSongInfoPromise.then((isValid) => {
							isSongInfoValid = isValid;
							return isValid;
						}).catch(() => {
							isSongInfoValid = false;
							return false;
						});
					}

					return isSongInfoValid;
				});
			});
			return loadSongInfoSequence.then((isValid) => {
				let forceRecognize = localStorage.forceRecognize === '1';
				song.flags.attr('isLastfmValid', isValid || forceRecognize);
			});
		}

		return Promise.resolve().then(() => {
			song.flags.attr('isLastfmValid', true);
		});
	}

	return {
		loadSong: loadSong
	};
});
