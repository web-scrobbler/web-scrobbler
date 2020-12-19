import { NotificationsRepository } from './notifications/NotificationsRepository';
import { NotificationsRepositoryImpl } from './notifications/NotificationsRepositoryImpl';

import { createNotificationsStorage } from '@/background/storage2/StorageFactory';

export function getNotificationsRepository(): NotificationsRepository {
	return notificationsRepository;
}

const notificationsRepository = new NotificationsRepositoryImpl(
	createNotificationsStorage()
);
