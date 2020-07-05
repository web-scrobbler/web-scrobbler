import SavedEdits from '@/background/storage/saved-edits';

/**
 * Fill song info by user defined values.
 *
 * @param {Object} song Song instance
 */
export async function process(song) {
	song.flags.isCorrectedByUser = await SavedEdits.loadSongInfo(song);
}
