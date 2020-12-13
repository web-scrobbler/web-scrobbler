import { expect } from 'chai';

import { getTestName } from '#/helpers/util';
import { MockedStorage } from '#/mock/MockedStorage';

import { NotificationsRepository } from '@/background/repository/notifications/NotificationsRepository';
import { NotificationsRepositoryData } from '@/background/repository/notifications/NotificationsRepositoryData';
import { NotificationsRepositoryImpl } from '@/background/repository/notifications/NotificationsRepositoryImpl';

describe(getTestName(__filename), () => {
	describe('test notifications repository', testNotificationsRepository);
});

function testNotificationsRepository() {
	const repository = createNotificationsRepository();

	it('should allow to display auth notifications', () => {
		return expect(repository.shouldDisplayAuthNotification()).to.be
			.eventually.true;
	});

	it('should disallow to display auth notifications', async () => {
		await repository.incrementAuthDisplayCount();
		await repository.incrementAuthDisplayCount();
		await repository.incrementAuthDisplayCount();

		return expect(repository.shouldDisplayAuthNotification()).to.be
			.eventually.false;
	});
}

function createNotificationsRepository(): NotificationsRepository {
	const mockedStorage = new MockedStorage<NotificationsRepositoryData>();
	return new NotificationsRepositoryImpl(mockedStorage);
}
