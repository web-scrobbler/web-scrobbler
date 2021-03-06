import { OnNotificationClickedListener } from '@/ui/notifications/TrackNotifications';

export interface AuthNotifications {
	/**
	 * Check if notifications are available.
	 *
	 * @return Check result
	 */
	areAvailable(): Promise<boolean>;

	/**
	 * Show an auth notification.
	 *
	 * @param onClicked Function that will be called on notification click
	 */
	showAuthNotification(
		onClicked: OnNotificationClickedListener
	): Promise<void>;
}
