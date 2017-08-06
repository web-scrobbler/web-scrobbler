'use strict';

/**
 *
 */
define([
	'pipeline/user-input',
	'pipeline/local-cache',
	'pipeline/lfm-metadata',
	'pipeline/musicbrainz-coverartarchive'
], function(UserInput, LocalCache, LfmMetadata, MusicBrainz) {

	return {
		processSong: function(song) {
			// list of processors is recreated for every processing call
			const processors = [
				UserInput.loadData, // loads data stored by user
				LocalCache.loadData, // loads data filled by user from storage
				LfmMetadata.loadSong, // loads song metadata from L.FM and sets validation flag
			];
			const optionalProcessors = [
				MusicBrainz.getCoverArt // looks for fallback cover art via API, in the even that it wasn't found earlier
			];

			const cb = function() {
				if (processors.length > 0) {
					const next = processors.shift();
					next(song, cb);
				} else {
					song.flags.attr('isProcessed', true);
					if (optionalProcessors.length > 0) {
						const next = optionalProcessors.shift();
						next(song, cb);
					}
				}
			};

			// reset possible flag, so we can detect changes on repeated processing of the same song
			song.flags.attr('isProcessed', false);

			cb();
		}
	};
});
