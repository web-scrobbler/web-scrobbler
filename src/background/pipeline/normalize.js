import Song from '@/background/object/song';

/**
 * Normalize info fields of given track.
 *
 * @param {Object} song Song object
 */
export function process(song) {
	for (const field of Song.BASE_FIELDS) {
		const fieldValue = song.processed[field];
		if (typeof fieldValue === 'string' && fieldValue) {
			song.processed[field] = fieldValue.normalize();
		}
	}
}
