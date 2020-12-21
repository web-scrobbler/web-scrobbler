import { browser } from 'webextension-polyfill-ts';

import { Notifier } from '@/background/auth-reminder/Notifier';
import { showAuthNotification } from '@/background/browser/notifications';

export class NotifierImpl implements Notifier {
	async notify(): Promise<void> {
		const authUrl = browser.runtime.getURL(
			'/ui/options/index.html#accounts'
		);
		try {
			await showAuthNotification(() => {
				browser.tabs.create({ url: authUrl });
			});
		} catch {
			// Fallback for browsers with no notifications support.
			await browser.tabs.create({ url: authUrl });
		}
	}
}
