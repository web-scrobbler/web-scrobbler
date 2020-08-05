import { Song } from '@/background/object/song';

import { SongDiff } from '@/background/pipeline/pipeline';
import { ProcessedSongInfo } from '@/background/object/song';

/**
 * Normalize fields of a given song.
 *
 * Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize.
 *
 * @param song Song object
 *
 * @return Normalized song fields
 */
export async function normalizeFields(song: Song): Promise<SongDiff> {
	const processed: Partial<ProcessedSongInfo> = {};

	for (const field of Song.BASE_FIELDS) {
		const fieldValue = song.getField(field);

		if (fieldValue !== null) {
			processed[field] = fieldValue.normalize();
		}
	}
	return Promise.resolve({ processed });
}
