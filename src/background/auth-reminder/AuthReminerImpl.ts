import { AuthReminder } from '@/background/auth-reminder/AuthReminder';
import { Notifier } from '@/background/auth-reminder/Notifier';

import { NotificationsRepository } from '@/background/repository/notifications/NotificationsRepository';

/**
 * How many times to show auth notification.
 */
const maxNotificationDisplayCount = 3;

export class AuthReminderImpl implements AuthReminder {
	constructor(
		private repository: NotificationsRepository,
		private notifier: Notifier
	) {}

	async remind(): Promise<void> {
		const authDisplayCount = await this.repository.getAuthDisplayCount();
		if (authDisplayCount > maxNotificationDisplayCount) {
			return;
		}

		await this.notifier.notify();
		await this.repository.setAuthDisplayCount(authDisplayCount + 1);
	}
}
