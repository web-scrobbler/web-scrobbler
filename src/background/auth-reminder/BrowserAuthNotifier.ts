import { browser } from 'webextension-polyfill-ts';

import type { AuthNotifier } from '@/background/auth-reminder/AuthNotifier';
import type { Notifications } from '@/background/browser/notifications/Notifications';

export class BrowserAuthNotifier implements AuthNotifier {
	constructor(private notifications: Notifications) {}

	async notify(): Promise<void> {
		const authUrl = browser.runtime.getURL(
			'/ui/options/index.html#accounts'
		);

		if (await this.notifications.areAvailable()) {
			this.notifications.showAuthNotification(() => {
				browser.tabs.create({ url: authUrl });
			});
		} else {
			// Fallback for browsers with no notifications support.
			await browser.tabs.create({ url: authUrl });
		}
	}
}
