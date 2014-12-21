'use strict';

define([], function() {

	return {
		loadData: function (song, cb) {
			var changed = false;

			// currently just transforms user data from metadata to processed data,
			// which makes it source data for next pipeline steps
			if (song.metadata.attr('userArtist')) {
				song.processed.attr('artist', song.metadata.attr('userArtist'));
				changed = true;
			}
			if (song.metadata.attr('userTrack')) {
				song.processed.attr('track', song.metadata.attr('userTrack'));
				changed = true;
			}

			if (changed) {
				song.flags.attr('isCorrectedByUser', true);
			}

			cb();
		}
	};

});
