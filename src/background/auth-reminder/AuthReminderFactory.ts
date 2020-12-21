import { AuthReminder } from '@/background/auth-reminder/AuthReminder';
import { AuthReminderImpl } from '@/background/auth-reminder/AuthReminerImpl';
import { NotifierImpl } from '@/background/auth-reminder/NotifierImpl';

import { getNotificationsRepository } from '@/background/repository/GetNotificationsRepository';

export function createAuthReminder(): AuthReminder {
	const repository = getNotificationsRepository();
	const notificator = new NotifierImpl();

	return new AuthReminderImpl(repository, notificator);
}
