'use strict';

/**
 * Service to handle all scrobbling behaviour.
 */
define([], function () {

	/**
	 * Scrobblers that are bound, meaning they have valid session IDs.
	 *
	 * @type {Array}
	 */
	var boundScrobblers = [];

	/**
	 * Scrobblers that are registered and that can be bound.
	 *
	 * @type {Array}
	 */
	var registeredScrobblers = [];

	function isScrobblerInArray(scrobbler, array) {
		return array.some(s => {
			return s.getLabel() === scrobbler.getLabel();
		});
	}

	function registerScrobbler(scrobbler) {
		if (!isScrobblerInArray(scrobbler, registeredScrobblers)) {
			console.log('ScrobbleService: registerScrobbler(): ' + scrobbler.getLabel());
			registeredScrobblers.push(scrobbler);
		}
	}

	return {

		/**
		 * Register given scrobblers.
		 *
		 * @param unboundScrobblers
		 * @returns {Promise.<Array>}
		 */
		registerScrobblers: function(unboundScrobblers) {
			// Convert each `getSession` call into Promise
			let promises = unboundScrobblers.map(scrobbler => {
				return new Promise(resolve => {
					scrobbler.getSession(sessionId => {
						registerScrobbler(scrobbler);

						if (sessionId) {
							this.bindScrobbler(scrobbler);
						}

						resolve();
					});
				});
			});

			return Promise.all(promises).then(() => boundScrobblers);
		},

		/**
		 * Bind given scrobbler.
		 *
		 * @param scrobbler
		 */
		bindScrobbler: function (scrobbler) {
			if (!isScrobblerInArray(scrobbler, boundScrobblers)) {
				boundScrobblers.push(scrobbler);
				console.log('ScrobbleService: bindScrobbler() ' + scrobbler.getLabel() + ' total:' + boundScrobblers.length);
			}
		},


		/**
		 * Unbind given scrobbler.
		 *
		 * @param scrobbler
		 */
		unbindScrobbler: function (scrobbler) {
			if (isScrobblerInArray(scrobbler, boundScrobblers)) {
				boundScrobblers = boundScrobblers.filter(function (s) {
					return s !== scrobbler;
				});

				console.log('ScrobbleService: unbindScrobbler() ' + scrobbler.getLabel() + ' total:' + boundScrobblers.length);

			} else {
				console.error(scrobbler.getLabel() + ' is not bound');
			}
		},

		/**
		 * Send now playing notification to each bound scrobbler.
		 *
		 * @param song
		 * @param cb
		 */
		sendNowPlaying: function (song, cb) {
			console.log('ScrobbleService: sendNowPlaying() ' + boundScrobblers.length);
			boundScrobblers.map(scrobbler => {
				scrobbler.sendNowPlaying(song, cb);
			});
		},

		/**
		 * Scrobble to each bound scrobbler.
		 *
		 * @param song
		 * @param cb
		 */
		scrobble: function (song, cb) {
			console.log('ScrobbleService: scrobble() ' + boundScrobblers.length);
			boundScrobblers.map(scrobbler => {
				scrobbler.scrobble(song, cb);
			});
		},

		/**
		 * Get all bound scrobblers.
		 *
		 * @returns {Array}
		 */
		getAllBound: function() {
			return boundScrobblers;
		},

		/**
		 * Get scrobbler by label.
		 *
		 * @param label
		 * @returns {BaseScrobbler|null}
		 */
		getScrobblerByLabel: function(label) {
			for (let scrobbler of registeredScrobblers) {
				if (scrobbler.getLabel() === label) {
					return scrobbler;
				}
			}

			return null;
		}
	};
});
