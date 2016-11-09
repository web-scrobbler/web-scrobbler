'use strict';

define([
	'services/scrobbleService'
], function(ScrobbleService) {

	return {
		loadSong: function (song, cb) {

			var onLoaded = function (isLfmValid) {
				cb(isLfmValid);
			};

			let scrobbler = ScrobbleService.getFirstBound();

			console.log('metadata loadSong() using: ' + scrobbler.getLabel());

			// load song metadata and update validation flag
			scrobbler.loadSongInfo(song, onLoaded);
		}
	};

});
