import { browser } from 'webextension-polyfill-ts';

import type { TabOpener } from '@/background/authenticator/tab-opener/TabOpener';

export const browserTabOpener: TabOpener = async (url: string) => {
	const tab = await browser.tabs.create({ url });

	return new Promise((resolve) => {
		function onTabRemovedListener(tabId: number): void {
			if (tabId !== tab.id) {
				return;
			}

			browser.tabs.onRemoved.removeListener(onTabRemovedListener);

			resolve();
		}

		browser.tabs.onRemoved.addListener(onTabRemovedListener);
	});
};
