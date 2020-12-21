import { Storage } from '@/background/storage2/Storage';
import { NotificationsRepository } from './NotificationsRepository';
import { NotificationsRepositoryData } from './NotificationsRepositoryData';

export class NotificationsRepositoryImpl implements NotificationsRepository {
	private notificationsStorage: Storage<NotificationsRepositoryData>;

	constructor(storage: Storage<NotificationsRepositoryData>) {
		this.notificationsStorage = storage;
	}

	async getAuthDisplayCount(): Promise<number> {
		const { authDisplayCount } = await this.notificationsStorage.get();
		return authDisplayCount || 0;
	}

	async setAuthDisplayCount(authDisplayCount: number): Promise<void> {
		return this.notificationsStorage.update({ authDisplayCount });
	}
}
