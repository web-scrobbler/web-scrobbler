'use strict';

/**
 * The module applies functions provided by pipeline stages to given song.
 */
define((require) => {
	const UserInput = require('pipeline/user-input');
	const Metadata = require('pipeline/metadata');
	const Normalize = require('pipeline/normalize');
	const CoverArtArchive = require('pipeline/coverartarchive');

	/**
	 * List of processors.
	 * Each processor is an object contains `process` function takes song object
	 * and returns Promise.
	 * @type {Array}
	 */
	const PROCESSORS = [
		Normalize,
		/**
		 * Load data submitted by user.
		 */
		UserInput,
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
		async processSong(song) {
			/*
			 * Reset possible flag, so we can detect changes
			 * on repeated processing of the same song.
			 */
			song.flags.isProcessed = false;

			console.log(`Execute processors: ${PROCESSORS.length}`);

			for (let processor of PROCESSORS) {
				await processor.process(song);
			}

			song.flags.isProcessed = true;
		}
	};
});
