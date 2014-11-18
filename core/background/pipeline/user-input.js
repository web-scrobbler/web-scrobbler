'use strict';

define([], function() {

	return {
		loadData: function (song, cb) {
			// currently just transforms user data from metadata to processed data,
			// which makes it source data for next pipeline steps
			if (song.metadata.attr('userArtist')) {
				song.processed.attr('artist', song.metadata.attr('userArtist'));
			}
			if (song.metadata.attr('userTrack')) {
				song.processed.attr('track', song.metadata.attr('userTrack'));
			}

			cb();
		}
	};

});
