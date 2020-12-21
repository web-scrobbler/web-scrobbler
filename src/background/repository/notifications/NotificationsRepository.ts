export interface NotificationsRepository {
	getAuthDisplayCount(): Promise<number>;
	setAuthDisplayCount(authDisplayCount: number): Promise<void>;
}
