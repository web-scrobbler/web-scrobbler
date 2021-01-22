import type { AuthRemindFunction } from '@/background/auth-remind/AuthRemindFunction';

import { basicAuthRemind } from '@/background/auth-remind/BasicAuthRemind';
import { notifyViaBrowserNotification } from '@/background/auth-remind/BrowserNotify';

import { getNotificationsRepository } from '@/background/repository/GetNotificationsRepository';

export function createAuthRemindFunction(): AuthRemindFunction {
	const repository = getNotificationsRepository();
	return () => basicAuthRemind(repository, notifyViaBrowserNotification);
}
