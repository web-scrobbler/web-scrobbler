'use strict';

/**
 * This pipeline stage normalizes track info fields.
 */

define(() => {
	const fieldsToNormalize = ['artist', 'track', 'album'];

	/**
	 * Normalize info fields of given track.
	 * @param  {[type]} song Song object
	 */
	function process(song) {
		for (let field of fieldsToNormalize) {
			let fieldValue = song.processed[field];
			if (typeof(fieldValue) === 'string' && fieldValue) {
				song.processed[field] = fieldValue.normalize();
			}
		}
	}

	return { process };
});
