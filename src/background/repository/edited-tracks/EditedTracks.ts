import { Song } from '@/background/model/song/Song';
import { EditedTrackInfo } from '@/background/repository/edited-tracks/EditedTrackInfo';

/**
 * EditedTracks repository.
 */
export interface EditedTracks {
	/**
	 * Get edited song info for the given song.
	 *
	 * @param song Song object
	 *
	 * @return True if data is loaded; false otherwise
	 */
	getSongInfo(song: Song): Promise<EditedTrackInfo>;

	/**
	 * Save the given edited info of the given song.
	 *
	 * @param song Song object
	 * @param editedInfo Edited song info
	 */
	setSongInfo(song: Song, editedInfo: EditedTrackInfo): Promise<void>;

	/**
	 * Remove edited song info of the given song.
	 *
	 * @param song Song object
	 */
	deleteSongInfo(song: Song): Promise<void>;

	/**
	 * Remove all entries.
	 */
	clear(): Promise<void>;
}
