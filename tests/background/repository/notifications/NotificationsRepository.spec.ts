import { expect } from 'chai';

import { getTestName } from '#/helpers/util';
import { MockedStorage } from '#/mock/MockedStorage';

import { NotificationsRepository } from '@/background/repository/notifications/NotificationsRepository';
import { NotificationsRepositoryImpl } from '@/background/repository/notifications/NotificationsRepositoryImpl';

describe(getTestName(__filename), testNotificationsRepository);

function testNotificationsRepository() {
	const repository = createNotificationsRepository();

	it('should return 0 when initialized', async () => {
		const authDisplayCount = await repository.getAuthDisplayCount();
		expect(authDisplayCount).to.be.equal(0);
	});

	it('should set auth display count', async () => {
		await repository.setAuthDisplayCount(3);

		const authDisplayCount = await repository.getAuthDisplayCount();
		expect(authDisplayCount).to.be.equal(3);
	});
}

function createNotificationsRepository(): NotificationsRepository {
	return new NotificationsRepositoryImpl(new MockedStorage());
}
