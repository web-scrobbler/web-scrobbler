export interface NotificationsRepository {
	incrementAuthDisplayCount(): Promise<void>;
	shouldDisplayAuthNotification(): Promise<boolean>;
}
