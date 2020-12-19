import { NotificationsRepository } from './notifications/NotificationsRepository';
import { NotificationsRepositoryImpl } from './notifications/NotificationsRepositoryImpl';
import { NotificationsRepositoryData } from './notifications/NotificationsRepositoryData';

import { createNotificationsStorage } from '@/background/storage2/StorageFactory';

export function getNotificationsRepository(): NotificationsRepository {
	return notificationsRepository;
}

function createNotificationsRepository(): NotificationsRepository {
	const coreStorage = createNotificationsStorage<
		NotificationsRepositoryData
	>();
	return new NotificationsRepositoryImpl(coreStorage);
}

const notificationsRepository = createNotificationsRepository();
