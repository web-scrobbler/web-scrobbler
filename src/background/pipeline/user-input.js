import SavedEdits from '@/background/storage/saved-edits';

/**
 * Fill song info by user defined values.
 *
 * @param {Object} song Song instance
 */
export async function process(song) {
	let isSongInfoLoaded = false;
	try {
		isSongInfoLoaded = await SavedEdits.loadSongInfo(song);
	} catch (e) {
		// Do nothing
	}

	song.flags.isCorrectedByUser = isSongInfoLoaded;
}
