import type { EditedTrackInfo } from '@/background/repository/edited-tracks/EditedTrackInfo';
import type { EditedTracksRepositoryData } from '@/background/repository/edited-tracks/EditedTracksRepositoryData';

/**
 * EditedTracks repository.
 */
export interface EditedTracks {
	/**
	 * Get all edited tracks.
	 *
	 * @return Edited tracks
	 */
	getEditedTracks(): Promise<EditedTracksRepositoryData>;

	/**
	 * Import edited tracks.
	 */
	importEditedTracks(data: EditedTracksRepositoryData): Promise<void>;

	/**
	 * Get edited track info for the given song. Return null if track info
	 * does not exist.
	 *
	 * @param song Song object
	 *
	 * @return Edited track info
	 * @throws Throws an error if song does not contain unique ID
	 */
	getSongInfo(songId: Iterable<string>): Promise<EditedTrackInfo>;

	/**
	 * Save the given edited info of the given song.
	 *
	 * @param songId Song unique ID
	 * @param editedInfo Edited song info
	 */
	setSongInfo(songId: string, editedInfo: EditedTrackInfo): Promise<void>;

	/**
	 * Remove edited song info of the given song.
	 *
	 * @param songId Song unique ID
	 */
	deleteSongInfo(songId: string): Promise<void>;

	/**
	 * Remove all entries.
	 */
	clear(): Promise<void>;
}
