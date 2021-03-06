import { browser } from 'webextension-polyfill-ts';

import type { AuthNotifier } from '@/background/auth-reminder/AuthNotifier';
import type { AuthNotifications } from '@/ui/notifications/AuthNotifications';

export class BrowserAuthNotifier implements AuthNotifier {
	constructor(private notifications: AuthNotifications) {}

	async notify(): Promise<void> {
		const authUrl = browser.runtime.getURL(
			'/ui/options/index.html#accounts'
		);

		if (await this.notifications.areAvailable()) {
			await this.notifications.showAuthNotification(() => {
				browser.tabs.create({ url: authUrl });
			});
		} else {
			// Fallback for browsers with no notifications support.
			await browser.tabs.create({ url: authUrl });
		}
	}
}
