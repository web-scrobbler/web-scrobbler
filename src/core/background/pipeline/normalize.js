'use strict';

/**
 * This pipeline stage normalizes track info fields.
 */

define(() => {
	const FIELDS_TO_NORMALIZE = ['artist', 'track', 'album'];

	/**
	 * Normalize info fields of given track.
	 * @param  {[type]} song Song object
	 */
	function process(song) {
		for (let field of FIELDS_TO_NORMALIZE) {
			let fieldValue = song.processed[field];
			if (typeof(fieldValue) === 'string' && fieldValue) {
				song.processed[field] = fieldValue.normalize();
			}
		}
	}

	return { process };
});
