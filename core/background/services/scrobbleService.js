'use strict';

/**
 * Service to handle all scrobbling behaviour.
 */
define([], function () {
	var scrobblers = [];

	console.log('ScrobbleService: start ' + scrobblers.length);

	return {
		bindScrobbler: function (scrobbler) {
			scrobblers.push(scrobbler);
			console.log('ScrobbleService: bindScrobbler() ' + scrobblers.length);
		},

		unbindScrobbler: function (scrobbler) {
			console.log('ScrobbleService: unbindScrobbler()');
			scrobblers = this.scrobblers.filter(
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
		}
	};
});
