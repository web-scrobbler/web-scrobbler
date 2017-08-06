'use strict';

/**
 * The module applies functions provided by pipeline stages to given song.
 */
define([
	'pipeline/user-input',
	'pipeline/local-cache',
	'pipeline/metadata',
	'pipeline/coverartarchive'
], function(UserInput, LocalCache, Metadata, CoverArtArchive) {
	/**
	 * List of processors.
	 * Each procesor is an object contains `process` function takes song object
	 * and returns Promise.
	 * @type {Array}
	 */
	const processors = [
		/**
		 * Load data submitted by user.
		 */
		UserInput,
		//
		/**
		 * Load data filled by user from storage.
		 */
		LocalCache,
		/**
		 * Load song metadata using ScrobbleService.
		 */
		Metadata,
		/**
		 * Looks for fallback cover art using Cover Art Archive service.
		 */
		CoverArtArchive,
	];

	return {
		/**
		 * Process song using pipeline processors.
		 * @param  {Object} song Song instance
		 */
		processSong(song) {
			// reset possible flag, so we can detect changes
			// on repeated processing of the same song
			song.flags.attr('isProcessed', false);

			let processorsSequence = Promise.resolve();
			for (let processor of processors) {
				processorsSequence = processorsSequence.then(() => {
					return processor.process(song);
				});
			}

			processorsSequence.then(() => {
				song.flags.attr('isProcessed', true);
			});
		}
	};
});
