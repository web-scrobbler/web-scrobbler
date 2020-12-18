import {
	ClonedSong,
	EditedSongInfo,
	LoveStatus,
} from '@/background/object/song';

export interface ControllerCommunicator {
	/**
	 * Send a request to correct the now playing track.
	 *
	 * @param editedInfo Edited track info
	 */
	correctTrack(editedInfo: EditedSongInfo): Promise<void>;

	/**
	 * Send a request to get a label of the active connector.
	 *
	 * @return Connector label
	 */
	getConnectorLabel(): Promise<string>;

	/**
	 * Send a request to get the now playing track.
	 *
	 * @return Cloned song
	 */
	getTrack(): Promise<ClonedSong>;

	/**
	 * Send a request to reset the now playing track.
	 */
	resetTrack(): Promise<void>;

	/**
	 * Send a request to ignore (don't scrobble) the now playing track.
	 */
	skipTrack(): Promise<void>;

	/**
	 * Send a request to love/unlove the now playing track.
	 *
	 * @param loveStatus Love status to set
	 *
	 * @return Updated love status
	 */
	toggleLove(loveStatus: LoveStatus): Promise<LoveStatus>;
}
