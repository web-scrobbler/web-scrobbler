'use strict';

/**
 *
 */
define([
	'pipeline/user-input',
	'pipeline/local-cache',
	'pipeline/metadata',
	'pipeline/musicbrainz-coverartarchive'
], function(UserInput, LocalCache, Metadata, MusicBrainz) {
	/**
	 * Get array of functions that return promises.
	 * Used for delayed promise execute.
	 * @param  {Object} song Song instance
	 * @return {Array} Array of promise factories
	 */
	function getProcessorFactories(song) {
		// list of processors promise factories is recreated
		// for every processing call
		return [
			// loads data stored by user
			UserInput.loadData,
			// loads data filled by user from storage
			LocalCache.loadData,
			// loads song metadata and sets validation flag
			Metadata.loadSong,
			// looks for fallback cover art via API,
			// in the even that it wasn't found earlier
			MusicBrainz.getCoverArt
		].map((processorFactory) => {
			return function() {
				return processorFactory(song);
			};
		});
	}

	return {
		/**
		 * Process song using pipeline processors.
		 * @param  {Object} song Song instance
		 */
		processSong: function(song) {
			// reset possible flag, so we can detect changes
			// on repeated processing of the same song
			song.flags.attr('isProcessed', false);

			let processorsSequence = Promise.resolve();
			for (let processorFactory of getProcessorFactories(song)) {
				processorsSequence = processorsSequence.then(processorFactory);
			}

			processorsSequence.then(() => {
				song.flags.attr('isProcessed', true);
			});
		}
	};
});
