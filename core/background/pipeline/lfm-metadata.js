'use strict';

define([
	'services/scrobbleService'
], function(ScrobbleService) {

	return {
		loadSong: function (song, cb) {

			var onLoaded = function (isLfmValid) {
				cb(isLfmValid);
			};

			var Scrobbler = ScrobbleService.getFirstBound();

			console.log('lfm-metadata loadSong() using: ' + Scrobbler.getLabel());

			// load song metadata and update attemptedLFMValidation flag
			Scrobbler.loadSongInfo(song, onLoaded);
		}
	};

});
