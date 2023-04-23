import Song from '@/core/object/song';
import RegexEdits from '@/core/storage/regex-edits';

/**
 * Fill song info by user defined regex edits.
 * @param song - Song instance
 */
export async function process(song: Song): Promise<void> {
	let isSongRegexLoaded = false;
	try {
		isSongRegexLoaded = await RegexEdits.loadSongInfo(song);
	} catch (e) {
		// Do nothing
	}

	song.flags.isRegexEditedByUser = isSongRegexLoaded;
}
