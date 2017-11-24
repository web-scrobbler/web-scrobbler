'use strict';

/**
 * The module applies functions provided by pipeline stages to given song.
 */
define((require) => {
	const Util = require('util');
	const UserInput = require('pipeline/user-input');
	const Metadata = require('pipeline/metadata');
	const LocalCache = require('pipeline/local-cache');
	const CoverArtArchive = require('pipeline/coverartarchive');

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
		 * @return {Promise} Promise that will be resolved when all processors process song
		 */
		processSong(song) {
			// Reset possible flag, so we can detect changes
			// on repeated processing of the same song.
			song.flags.attr('isProcessed', false);

			let factories = processors.map((processor) => processor.process);
			return Util.queuePromises(factories, song).then(() => {
				song.flags.attr('isProcessed', true);
			});
		}
	};
});
