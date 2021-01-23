import { NotifyFunction } from '@/background/auth-remind/AuthRemindFunction';
import { NotificationsRepository } from '@/background/repository/notifications/NotificationsRepository';

/**
 * How many times to show auth notification.
 */
const maxNotificationDisplayCount = 3;

export const basicAuthRemind = async (
	repository: NotificationsRepository,
	notifyFn: NotifyFunction
): Promise<void> => {
	const authDisplayCount = await repository.getAuthDisplayCount();
	if (authDisplayCount >= maxNotificationDisplayCount) {
		return;
	}

	await notifyFn();
	await repository.setAuthDisplayCount(authDisplayCount + 1);
};
