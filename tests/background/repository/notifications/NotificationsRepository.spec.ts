import { expect } from 'chai';

import { getTestName } from '#/helpers/util';
import { MockedStorage } from '#/mock/MockedStorage';

import { NotificationsRepository } from '@/background/repository/notifications/NotificationsRepository';
import { NotificationsRepositoryData } from '@/background/repository/notifications/NotificationsRepositoryData';
import { NotificationsRepositoryImpl } from '@/background/repository/notifications/NotificationsRepositoryImpl';

describe(getTestName(__filename), testNotificationsRepository);

function testNotificationsRepository() {
	const repository = createNotificationsRepository();

	it('should allow to display auth notifications', async () => {
		const shouldDisplay = await repository.shouldDisplayAuthNotification();
		expect(shouldDisplay).to.be.true;
	});

	it('should disallow to display auth notifications', async () => {
		await repository.notifyAuthNotificationDisplayed();
		await repository.notifyAuthNotificationDisplayed();
		await repository.notifyAuthNotificationDisplayed();

		const shouldDisplay = await repository.shouldDisplayAuthNotification();
		expect(shouldDisplay).to.be.false;
	});
}

function createNotificationsRepository(): NotificationsRepository {
	const mockedStorage = new MockedStorage<NotificationsRepositoryData>();
	return new NotificationsRepositoryImpl(mockedStorage);
}
