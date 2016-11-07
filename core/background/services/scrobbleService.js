'use strict';

/**
 * Service to handle all scrobbling behaviour.
 */
define([], function () {
	var scrobblers = [];

	console.log('ScrobbleService: init() total: ' + scrobblers.length);

	 function hasScrobbler() {
		return scrobblers.length !== 0;
	}

	return {
		bindScrobbler: function (scrobbler) {
			if (!scrobblers.some(function(s) { return s.getLabel() === scrobbler.getLabel();})) {
				scrobblers.push(scrobbler);
				console.log('ScrobbleService: bindScrobbler() ' + scrobbler.getLabel() + ' total:' + scrobblers.length);
			}
		},

		unbindScrobbler: function (scrobbler) {
			console.log('ScrobbleService: unbindScrobbler() ' + scrobbler.getLabel() + ' total:' + scrobblers.length);
			scrobblers = scrobblers.filter(
				function (s) {
					if (s !== scrobbler) {
						return s;
					}
				}
			);
		},
		sendNowPlaying: function (song, cb) {
			console.log('ScrobbleService: sendNowPlaying() ' + scrobblers.length);
			scrobblers.forEach(function (scrobbler) {
				scrobbler.sendNowPlaying(song, cb);
			});
		},

		scrobble: function (song, cb) {
			console.log('ScrobbleService: scrobble() ' + scrobblers.length);
			scrobblers.forEach(function (scrobbler) {
				scrobbler.scrobble(song, cb);
			});
		},

		hasScrobblers: hasScrobbler,

		getFirstBound: function() {
			if (!hasScrobbler()) {
				throw "No Scrobblers Bound";
			}

			return scrobblers[0];
		}
	};
});
