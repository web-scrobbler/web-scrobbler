import { Song } from '@/background/model/song/Song';

export interface Notifications {
	/**
	 * Check if browser notifications are available.
	 *
	 * Note that Chrome on Mac does not show notification while in fullscreen mode.
	 *
	 * @return Check result	 */

	areAvailable(): Promise<boolean>;

	/**
	 * Show now playing notification.
	 *
	 * @param song Song
	 * @param contextMessage Context message
	 * @param [onClick] Function that will be called on notification click
	 */
	showNowPlayingNotification(
		song: Song,
		contextMessage: string,
		onClick: OnClickedListener
	): Promise<void>;

	/**
	 * Remove now playing notification for the given song.
	 *
	 * @param song Song instance
	 */
	clearNowPlaying(song: Song): void;

	/**
	 * Show a notification the given song is not recognized.
	 *
	 * @param song Song instance
	 * @param [onClick] Function that will be called on notification click
	 */
	showSongNotRecognized(
		song: Song,
		onClick: OnClickedListener
	): Promise<void>;

	/**
	 * Show an auth notification.
	 *
	 * @param onClicked Function that will be called on notification click
	 */
	showAuthNotification(onClicked: OnClickedListener): Promise<void>;
}

export type OnClickedListener = (notificationId: string) => void;
