'use strict';

/**
 * Song object
 */
define([
	'wrappers/can'
], function(can) {
	/**
	 * @constructor
	 */
	return function(parsedData) {
		/**
		 * Safe copy of initial parsed data.
		 * Should not be changed during lifetime of this object
		 */
		var parsed = {
			artist: parsedData.artist || null,
			track: parsedData.track || null,
			album: parsedData.album || null,
			uniqueID: parsedData.uniqueID || null,
			duration: parsedData.duration || null
		};

		/**
		 * Post-processed song data, for example auto-corrected.
		 * Initially filled with parsed data and optionally changed
		 * as the object is processed in pipeline
		 */
		var processed = {
			artist: parsed.artist,
			track: parsed.track,
			album: parsed.album,
			duration: parsed.duration
		};

		/**
		 * Various optional data
		 */
		var metadata = {};

		/**
		 * Various flags
		 */
		var flags = {
			isProcessed: false, // has passed the pipeline
			isLastfmValid: null // don't know
		};

		return can.Map({
			parsed: parsed,
			processed: processed,
			metadata: metadata,
			flags: flags
		});
	};
});
