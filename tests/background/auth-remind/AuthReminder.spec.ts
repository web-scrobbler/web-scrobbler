import { expect } from 'chai';
import { spy } from 'chai';

import { describeModuleTest } from '#/helpers/util';
import { MemoryStorage } from '#/stub/MemoryStorage';

import { AuthNotifier } from '@/background/auth-reminder/AuthNotifier';
import { AuthReminder } from '@/background/auth-reminder/AuthReminder';
import { NotificationsRepositoryImpl } from '@/background/repository/notifications/NotificationsRepositoryImpl';

describeModuleTest(__filename, () => {
	let notifier: AuthNotifier;
	let reminder: AuthReminder;
	let notifySpy: unknown;

	beforeEach(() => {
		notifier = createNotifier();
		reminder = createReminder(notifier);

		notifySpy = spy.on(notifier, 'notify');
	});

	it('should call notify function', async () => {
		await reminder.notifyAuthIsRequired();

		expect(notifySpy).to.have.called.exactly(1);
	});

	it('should not call notify funciton more than 3 times', async () => {
		await reminder.notifyAuthIsRequired();
		await reminder.notifyAuthIsRequired();
		await reminder.notifyAuthIsRequired();
		await reminder.notifyAuthIsRequired();

		expect(notifySpy).to.have.called.exactly(3);
	});
});

function createNotifier(): AuthNotifier {
	return new (class implements AuthNotifier {
		notify(): Promise<void> {
			return Promise.resolve();
		}
	})();
}

function createReminder(notifier: AuthNotifier): AuthReminder {
	const repository = new NotificationsRepositoryImpl(new MemoryStorage());
	return new AuthReminder(repository, notifier);
}
