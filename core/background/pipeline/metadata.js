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
		// FIXME: `loadSongInfo` should return Promise object
		return ScrobbleService.getAllBound().map((scrobbler) => {
			// Don't execute the promise immediately and return factory function
			return function() {
				return new Promise((resolve) => {
					scrobbler.loadSongInfo(song, (isValid) => {
						resolve(isValid);
					});
				});
			};
		});
	}

	function loadSong(song, cb) {
		let isSongInfoValid = false;
		let loadSongInfoSequence = Promise.resolve();

		// Queue promises
		getLoadSongInfoFactories(song).forEach((loadSongInfoFactory) => {
			loadSongInfoSequence = loadSongInfoSequence.then(() => {
				// Should be checked in runtime
				if (!isSongInfoValid) {
					let loadSongInfoPromise = loadSongInfoFactory();
					return loadSongInfoPromise.then((isValid) => {
						isSongInfoValid = isValid;
					});
				}
			});
		});

		// Run all queued promises
		loadSongInfoSequence.then(() => {
			cb();
		}).catch((err) => {
			console.error(err);
		});
	}

	return {
		// FIXME: Convert pipeline functions into promises
		loadSong: loadSong
	};
});
