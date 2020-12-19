export interface NotificationsRepository {
	/**
	 * Notify if the auth notification is displayed.
	 */
	notifyAuthNotificationDisplayed(): Promise<void>;

	/**
	 * Check if the auth notification should be displayed.
	 *
	 * @return Check result
	 */
	shouldDisplayAuthNotification(): Promise<boolean>;
}
