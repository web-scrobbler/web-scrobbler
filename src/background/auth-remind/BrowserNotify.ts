import { browser } from 'webextension-polyfill-ts';
import { showAuthNotification } from '@/background/browser/notifications';

/**
 * Use browser notifications to display a reminder.
 */
export async function notifyViaBrowserNotification(): Promise<void> {
	const authUrl = browser.runtime.getURL('/ui/options/index.html#accounts');

	try {
		await showAuthNotification(() => {
			browser.tabs.create({ url: authUrl });
		});
	} catch {
		// Fallback for browsers with no notifications support.
		await browser.tabs.create({ url: authUrl });
	}
}
