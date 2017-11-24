'use strict';

/**
 * Service to handle all scrobbling behaviour.
 */
define((require) => {
	const LastFm = require('scrobblers/lastfm');
	const LibreFm = require('scrobblers/librefm');

	/**
	 * Scrobblers that are bound, meaning they have valid session IDs.
	 *
	 * @type {Array}
	 */
	const boundScrobblers = [];

	/**
	 * Scrobblers that are registered and that can be bound.
	 *
	 * @type {Array}
	 */
	const registeredScrobblers = [LastFm, LibreFm];

	/**
	 * Check if scrobbler is in given array of scrobblers.
	 * @param  {Object} scrobbler Scrobbler instance
	 * @param  {Array} array Array of scrobblers
	 * @return {Boolean} True if scrobbler is in array, false otherwise
	 */
	function isScrobblerInArray(scrobbler, array) {
		return array.some((s) => {
			return s.getLabel() === scrobbler.getLabel();
		});
	}

	return {
		/**
		 * Bind all registered scrobblers.
		 * @return {Promise} Promise that will resolve with array of bound scrobblers
		 */
		bindAllScrobblers() {
			// Convert each `getSession` call into Promise
			let promises = registeredScrobblers.map((scrobbler) => {
				return scrobbler.getSession().then(() => {
					this.bindScrobbler(scrobbler);
				}).catch(() => {
					console.warn(`Unable to bind ${scrobbler.getLabel()}`);
				});
			});

			return Promise.all(promises).then(() => boundScrobblers);
		},

		/**
		 * Bind given scrobbler.
		 * @param {Object} scrobbler Scrobbler instance
		 */
		bindScrobbler(scrobbler) {
			if (!isScrobblerInArray(scrobbler, boundScrobblers)) {
				boundScrobblers.push(scrobbler);
				console.log(`Bind ${scrobbler.getLabel()} scrobbler`);
			}
		},

		/**
		 * Unbind given scrobbler.
		 * @param {Object} scrobbler Scrobbler instance
		 */
		unbindScrobbler(scrobbler) {
			if (isScrobblerInArray(scrobbler, boundScrobblers)) {
				let index = boundScrobblers.indexOf(scrobbler);
				boundScrobblers.splice(index, 1);

				console.log(`Unbind ${scrobbler.getLabel()} scrobbler`);
			} else {
				console.error(`${scrobbler.getLabel()} is not bound`);
			}
		},

		/**
		 * Retrieve song info using scrobbler APIs.
		 * @param  {Object} song Song instance
		 * @return {Promise} Promise resolved with array of song info objects
		 */
		getSongInfo(song) {
			let scrobblers = registeredScrobblers.filter((scrobbler) => {
				return scrobbler.canLoadSongInfo();
			});
			console.log(`Send "get info" request: ${scrobblers.length}`);

			return Promise.all(scrobblers.map((scrobbler) => {
				return scrobbler.getSongInfo(song).catch(() => {
					console.warn(`Unable to get song info from ${scrobbler.label}`);
					return null;
				});
			}));
		},

		/**
		 * Send now playing notification to each bound scrobbler.
		 * @param  {Object} song Song instance
		 * @return {Promise} Promise that will be resolved then the task will complete
		 */
		sendNowPlaying(song) {
			console.log(`Send "now playing" request: ${boundScrobblers.length}`);

			return Promise.all(boundScrobblers.map((scrobbler) => {
				// Forward result (including errors) to caller
				return scrobbler.sendNowPlaying(song).catch((result) => {
					return this.processResult(scrobbler, result);
				});
			}));
		},

		/**
		 * Scrobble song to each bound scrobbler.
		 * @param  {Object} song Song instance
		 * @return {Promise} Promise that will be resolved then the task will complete
		 */
		scrobble(song) {
			console.log(`Send "scrobble" request: ${boundScrobblers.length}`);

			return Promise.all(boundScrobblers.map((scrobbler) => {
				// Forward result (including errors) to caller
				return scrobbler.scrobble(song).catch((result) => {
					return this.processResult(scrobbler, result);
				});
			}));
		},

		/**
		 * Toggle song love status.
		 * @param  {Object} song Song instance
		 * @param  {Boolean} flag Flag indicates song is loved
		 * @return {Promise} Promise that will be resolved then the task will complete
		 */
		toggleLove(song, flag) {
			return Promise.all(boundScrobblers.map((scrobbler) => {
				// Forward result (including errors) to caller
				return scrobbler.toggleLove(song, flag).catch((result) => {
					return this.processResult(scrobbler, result);
				});
			}));
		},

		/**
		 * Get all registered scrobblers.
		 * @return {Array} Array of bound scrobblers
		 */
		getRegisteredScrobblers() {
			return registeredScrobblers;
		},

		/**
		 * Get scrobbler by label.
		 * @param  {String} label Scrobbler label
		 * @return {Object} Found scrobbler object
		 */
		getScrobblerByLabel(label) {
			for (let scrobbler of registeredScrobblers) {
				if (scrobbler.getLabel() === label) {
					return scrobbler;
				}
			}

			return null;
		},

		/**
		 * Process result received from scrobbler.
		 * @param  {Object} scrobbler Scrobbler instance
		 * @param  {Object} result API call result
		 * @return {Promise} Promise resolved with result object
		 */
		processResult(scrobbler, result) {
			if (result.isAuthError()) {
				// Don't unbind scrobblers which have tokens
				return scrobbler.isReadyForGrantAccess().then((flag) => {
					if (!flag) {
						this.unbindScrobbler(scrobbler);
					}
					// Forward result
					return result;
				});
			}
			// Forward result
			return result;
		}
	};
});
