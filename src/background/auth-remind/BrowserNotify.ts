import { browser } from 'webextension-polyfill-ts';
import { Notifications } from '@/background/browser/notifications/Notifications';

/**
 * Use browser notifications to display a reminder.
 *
 * @param notifications Notifications
 */
export async function notifyViaBrowserNotification(
	notifications: Notifications
): Promise<void> {
	const authUrl = browser.runtime.getURL('/ui/options/index.html#accounts');

	if (await notifications.areAvailable()) {
		notifications.showAuthNotification(() => {
			browser.tabs.create({ url: authUrl });
		});
	} else {
		// Fallback for browsers with no notifications support.
		await browser.tabs.create({ url: authUrl });
	}
}
