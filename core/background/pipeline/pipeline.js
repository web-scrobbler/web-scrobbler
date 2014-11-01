'use strict';

/**
 *
 */
define([
	'pipeline/lfm-metadata'
], function(LfmMetadata) {

	return {
		processSong: function(song) {
			// list of processors is recreated for every processing call
			var processors = [
				LfmMetadata.loadSong // loads song metadata from L.FM and sets validation flag
			];

			var cb = function() {
				if (processors.length > 0) {
					var next =  processors.shift();
					next(song, cb);
				} else {
					// processing finished, just set the flag
					song.flags.attr('isProcessed', true);
				}
			};

			cb(song);
		}
	};
});
