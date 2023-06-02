import { debugLog } from '@/core/content/util';
import Song from '@/core/object/song';
import RegexEdits from '@/core/storage/regex-edits';

/**
 * Fill song info by user defined regex edits.
 * @param song - Song instance
 */
export async function process(song: Song): Promise<void> {
	// If song info was already corrected by user, skip this stage
	if (song.flags.isCorrectedByUser) {
		return;
	}
	try {
		await RegexEdits.loadSongInfo(song);
	} catch (err) {
		debugLog(err, 'error');
	}
}
