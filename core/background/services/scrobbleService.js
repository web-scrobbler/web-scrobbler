'use strict';

/**
 * Service to handle all scrobbling behaviour.
 */
define([
	'jquery',
	'scrobblers/lastfm',
	'scrobblers/librefm'
], function ($, LastFm, LibreFm) {

	var scrobblers = [];
	scrobblers.push(LastFm);
	scrobblers.push(LibreFm);

	return {
		sendNowPlaying: function (song, cb) {
			$.each(scrobblers, function(index, scrobbler) {
				scrobbler.sendNowPlaying(song, cb);
			});
		},

		scrobble: function(song, cb) {
			$.each(scrobblers, function(index, scrobbler) {
				scrobbler.scrobble(song, cb);
			});
		}
	};
});
