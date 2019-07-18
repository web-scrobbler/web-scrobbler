'use strict';

/**
 * This pipeline stage normalizes track info fields.
 */

define((require) => {
	const Song = require('object/song');

	/**
	 * Normalize info fields of given track.
	 * @param  {Object} song Song object
	 */
	function process(song) {
		for (let field of Song.BASE_FIELDS) {
			let fieldValue = song.processed[field];
			if (typeof(fieldValue) === 'string' && fieldValue) {
				song.processed[field] = fieldValue.normalize();
			}
		}
	}

	return { process };
});
