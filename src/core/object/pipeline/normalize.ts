/**
 * This pipeline stage normalizes track info fields.
 */
import Song from '@/core/object/song';

/**
 * Normalize info fields of given track.
 * @param song - Song object
 */
export function process(song: Song): void {
	for (const field of Song.BASE_FIELDS) {
		const fieldValue = song.processed[field];
		if (typeof fieldValue === 'string' && fieldValue) {
			song.processed[field] = fieldValue.normalize();
			song.noRegex[field] = fieldValue.normalize();
		}
	}
}
