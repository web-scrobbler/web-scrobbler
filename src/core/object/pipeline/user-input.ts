/**
 * The pipeline stage applies custom song info data to given song info.
 * Plus, it saves the song info to browser storage.
 */

import SavedEdits from '@/core/storage/saved-edits';
import Song from '@/core/object/song';
import RegexEdits from '@/core/storage/regex-edits';

/**
 * Fill song info by user defined values.
 * @param song - Song instance
 */
export async function process(song: Song): Promise<void> {
	let isSongInfoLoaded = false;
	try {
		isSongInfoLoaded = await SavedEdits.loadSongInfo(song);
	} catch (e) {
		// Do nothing
	}

	song.flags.isCorrectedByUser = isSongInfoLoaded;
}

/**
 * Fill song info by user defined regex edits.
 * @param song - Song instance
 */
export async function processRegex(song: Song): Promise<void> {
	let isSongRegexLoaded = false;
	try {
		isSongRegexLoaded = await RegexEdits.loadSongInfo(song);
	} catch (e) {
		// Do nothing
	}

	song.flags.isRegexEditedByUser = isSongRegexLoaded;
}
