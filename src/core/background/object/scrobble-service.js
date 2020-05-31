'use strict';

/**
 * Service to handle all scrobbling behavior.
 */
define((require) => {
	const ApiCallResult = require('object/api-call-result');
	const LastFmScrobbler = require('scrobbler/lastfm-scrobbler');
	const LibreFmScrobbler = require('scrobbler/librefm-scrobbler');
	const ListenBrainzScrobbler = require('scrobbler/listenbrainz-scrobbler');
	const MalojaScrobbler = require('scrobbler/maloja-scrobbler');

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
	const registeredScrobblers = [
		new LastFmScrobbler(),
		new LibreFmScrobbler(),
		new ListenBrainzScrobbler(),
		new MalojaScrobbler(),
	];

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
		 * @return {Array} Bound scrobblers
		 */
		async bindAllScrobblers() {
			for (const scrobbler of registeredScrobblers) {
				try {
					await scrobbler.getSession();
					this.bindScrobbler(scrobbler);
				} catch (e) {
					console.warn(`Unable to bind ${scrobbler.getLabel()}`);
				}
			}

			return boundScrobblers;
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
				const index = boundScrobblers.indexOf(scrobbler);
				boundScrobblers.splice(index, 1);

				console.log(`Unbind ${scrobbler.getLabel()} scrobbler`);
			} else {
				console.error(`${scrobbler.getLabel()} is not bound`);
			}
		},

		/**
		 * Retrieve song info using scrobbler APIs.
		 * @param  {Object} songInfo Object containing song info
		 * @return {Promise} Promise resolved with array of song info objects
		 */
		getSongInfo(songInfo) {
			const scrobblers = registeredScrobblers.filter((scrobbler) => {
				return scrobbler.canLoadSongInfo();
			});
			console.log(`Send "get info" request: ${scrobblers.length}`);

			return Promise.all(
				scrobblers.map((scrobbler) => {
					return scrobbler.getSongInfo(songInfo).catch(() => {
						console.warn(
							`Unable to get song info from ${scrobbler.getLabel()}`
						);
						return null;
					});
				})
			);
		},

		/**
		 * Send now playing notification to each bound scrobbler.
		 * @param  {Object} songInfo Object containing song info
		 * @return {Promise} Promise that will be resolved then the task will complete
		 */
		sendNowPlaying(songInfo) {
			console.log(
				`Send "now playing" request: ${boundScrobblers.length}`
			);

			return Promise.all(
				boundScrobblers.map((scrobbler) => {
					// Forward result (including errors) to caller
					return scrobbler
						.sendNowPlaying(songInfo)
						.catch((result) => {
							return this.processErrorResult(scrobbler, result);
						});
				})
			);
		},

		/**
		 * Scrobble song to each bound scrobbler.
		 * @param  {Object} songInfo Object containing song info
		 * @return {Promise} Promise that will be resolved then the task will complete
		 */
		scrobble(songInfo) {
			console.log(`Send "scrobble" request: ${boundScrobblers.length}`);

			return Promise.all(
				boundScrobblers.map((scrobbler) => {
					// Forward result (including errors) to caller
					return scrobbler.scrobble(songInfo).catch((result) => {
						return this.processErrorResult(scrobbler, result);
					});
				})
			);
		},

		/**
		 * Toggle song love status.
		 * @param  {Object} songInfo Object containing song info
		 * @param  {Boolean} flag Flag indicates song is loved
		 * @return {Promise} Promise that will be resolved then the task will complete
		 */
		toggleLove(songInfo, flag) {
			const scrobblers = registeredScrobblers.filter((scrobbler) => {
				return scrobbler.canLoveSong();
			});
			const requestName = flag ? 'love' : 'unlove';
			console.log(`Send "${requestName}" request: ${scrobblers.length}`);

			return Promise.all(
				scrobblers.map((scrobbler) => {
					// Forward result (including errors) to caller
					return scrobbler
						.toggleLove(songInfo, flag)
						.catch((result) => {
							return this.processErrorResult(scrobbler, result);
						});
				})
			);
		},

		/**
		 * Get all registered scrobblers.
		 * @return {Array} Array of bound scrobblers
		 */
		getRegisteredScrobblers() {
			return registeredScrobblers;
		},

		/**
		 * Get scrobbler by a given ID.
		 *
		 * @param {String} scrobblerId Scrobbler ID
		 *
		 * @return {Object} Found scrobbler object
		 */
		getScrobblerById(scrobblerId) {
			for (const scrobbler of registeredScrobblers) {
				if (scrobbler.getId() === scrobblerId) {
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
		async processErrorResult(scrobbler, result) {
			const isOtherError = result.is(ApiCallResult.ERROR_OTHER);
			const isAuthError = result.is(ApiCallResult.ERROR_AUTH);

			if (!(isOtherError || isAuthError)) {
				throw new Error(`Invalid result: ${result}`);
			}

			if (isAuthError) {
				// Don't unbind scrobblers which have tokens
				const isReady = await scrobbler.isReadyForGrantAccess();
				if (!isReady) {
					this.unbindScrobbler(scrobbler);
				}
			}

			// Forward result
			return result;
		},
	};
});
