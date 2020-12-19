import { Storage } from '@/background/storage2/Storage';
import { NotificationsRepository } from './NotificationsRepository';
import { NotificationsRepositoryData } from './NotificationsRepositoryData';

/**
 * How many times to show auth notification.
 */
const authNotificationDisplayCount = 3;

export class NotificationsRepositoryImpl implements NotificationsRepository {
	private notificationsStorage: Storage<NotificationsRepositoryData>;

	constructor(storage: Storage<NotificationsRepositoryData>) {
		this.notificationsStorage = storage;
	}

	async shouldDisplayAuthNotification(): Promise<boolean> {
		const authDisplayCount = await this.getAuthDisplayCount();
		return authDisplayCount < authNotificationDisplayCount;
	}

	async notifyAuthNotificationDisplayed(): Promise<void> {
		const authDisplayCount = await this.getAuthDisplayCount();
		return this.notificationsStorage.update({
			authDisplayCount: authDisplayCount + 1,
		});
	}

	private async getAuthDisplayCount(): Promise<number> {
		const { authDisplayCount } = await this.notificationsStorage.get();
		return authDisplayCount || 0;
	}
}
