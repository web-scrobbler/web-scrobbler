'use strict';

define([
	'services/scrobbleService'
], function(ScrobbleService) {

	return {
		loadSong: function (song, cb) {

			var isSongValid = false;

			var onLoaded = function (isLfmValid) {
				isSongValid = isLfmValid;
			};


			let scrobblers = ScrobbleService.getAllBound();

			for (var index in scrobblers) {
				let scrobbler = scrobblers[index];
				console.log('metadata loadSong() attempt using: ' + scrobbler.getLabel());

				// load song metadata and update validation flag
				scrobbler.loadSongInfo(song, onLoaded);

				if (isSongValid) {
					break;
				}
			}

			console.log('metadata loadSong() valid:' + isSongValid);

			cb(isSongValid);
		}
	};

});
