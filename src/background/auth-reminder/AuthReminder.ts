import type { AuthNotifier } from '@/background/auth-reminder/AuthNotifier';
import type { NotificationsRepository } from '@/background/repository/notifications/NotificationsRepository';

/**
 * Helper to display authentication reminder.
 */
export class AuthReminder {
	constructor(
		private repository: NotificationsRepository,
		private notifier: AuthNotifier
	) {}

	/**
	 * Notify authentication is required, but only several times.
	 */
	async notifyAuthIsRequired(): Promise<void> {
		const authDisplayCount = await this.repository.getAuthDisplayCount();

		if (authDisplayCount < maxNotificationDisplayCount) {
			await this.notifier.notify();
			await this.repository.setAuthDisplayCount(authDisplayCount + 1);
		}
	}
}

/**
 * How many times to show auth notification.
 */
const maxNotificationDisplayCount = 3;
