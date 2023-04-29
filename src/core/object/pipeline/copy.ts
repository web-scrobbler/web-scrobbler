/**
 * This pipeline stage copies song info from parsed to processed for further processing.
 */
import Song from '@/core/object/song';

/**
 * Copy data from parsed to processed fields.
 * @param song - Song object
 */
export function process(song: Song): void {
	for (const field of Song.PROCESSED_FIELDS) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- We know we are always setting to the same field even though typescript doesnt
		(song.processed[field] as any) = song.parsed[field];
	}
}
