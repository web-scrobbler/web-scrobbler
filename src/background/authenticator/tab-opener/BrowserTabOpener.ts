import { browser } from 'webextension-polyfill-ts';

import type { TabOpener } from '@/background/authenticator/tab-opener/TabOpener';

export const browserTabOpener: TabOpener = async (url: string) => {
	const tab = await browser.tabs.create({ url });

	return new Promise((resolve) => {
		browser.tabs.onRemoved.addListener(function (tabId: number): void {
			if (tabId !== tab.id) {
				return;
			}

			resolve();
			browser.tabs.onRemoved.removeListener(this);
		});
	});
};
