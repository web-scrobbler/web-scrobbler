'use strict';

define([
	'services/lastfm'
], function(LastFM) {

	return {
		loadSong: function (song, cb) {
			var onLoaded = function (isLfmValid) {
				cb(isLfmValid);
			};

			// load song metadata and update attemptedLFMValidation flag
			LastFM.loadSongInfo(song, onLoaded);
		}
	};

});
