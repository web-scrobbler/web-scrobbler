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

	function hasScrobbler() {
		return boundScrobblers.length !== 0;
	}

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
		bindScrobblers: function(unboundScrobblers) {
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

		bindScrobbler: function (scrobbler) {
			if (!isScrobblerInArray(scrobbler, boundScrobblers)) {
				boundScrobblers.push(scrobbler);
				console.log('ScrobbleService: bindScrobbler() ' + scrobbler.getLabel() + ' total:' + boundScrobblers.length);
			}
		},

		unbindScrobbler: function (scrobbler) {
			boundScrobblers = boundScrobblers.filter(
				function (s) {
					if (s !== scrobbler) {
						return s;
					} else {
						console.log('ScrobbleService: unbindScrobbler() ' + scrobbler.getLabel() + ' total:' + boundScrobblers.length);
					}
				}
			);
		},

		sendNowPlaying: function (song, cb) {
			console.log('ScrobbleService: sendNowPlaying() ' + boundScrobblers.length);
			boundScrobblers.forEach(function (scrobbler) {
				scrobbler.sendNowPlaying(song, cb);
			});
		},

		scrobble: function (song, cb) {
			console.log('ScrobbleService: scrobble() ' + boundScrobblers.length);
			boundScrobblers.forEach(function (scrobbler) {
				scrobbler.scrobble(song, cb);
			});
		},

		getFirstBound: function() {
			if (!hasScrobbler()) {
				throw 'No Scrobblers Bound';
			}

			return boundScrobblers[0];
		},

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
