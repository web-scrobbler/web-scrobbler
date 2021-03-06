import type { LoveStatus } from '@/background/model/song/LoveStatus';
import type { SongDto } from '@/background/model/song/SongDto';
import type { EditedTrackInfo } from '@/background/repository/edited-tracks/EditedTrackInfo';

export interface ControllerCommunicator {
	/**
	 * Send a request to correct the now playing track.
	 *
	 * @param editedInfo Edited track info
	 */
	correctTrack(editedInfo: EditedTrackInfo): Promise<void>;

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
	getTrack(): Promise<SongDto>;

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
