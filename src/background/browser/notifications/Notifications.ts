import { Song } from '@/background/model/song/Song';

export interface Notifications {
	/**
	 * Check if notifications are available.
	 *
	 * @return Check result
	 */

	areAvailable(): Promise<boolean>;

	/**
	 * Remove a notification for the given song.
	 *
	 * @param song Song
	 */
	clearNotification(song: Song): void;

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
	 * Show a notification the given song is not recognized.
	 *
	 * @param song Song
	 * @param [onClick] Function that will be called on notification click
	 */
	showNotRecognizedNotification(
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
