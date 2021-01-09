import { browser } from 'webextension-polyfill-ts';

/**
 * Open a new tab with the given URL.
 *
 * @param url URL to open
 *
 * @return Promise which is resolved when the tab is closed
 */
export async function openTabInBrowser(url: string): Promise<void> {
	const tab = await browser.tabs.create({ url });

	return new Promise((resolve) => {
		browser.tabs.onRemoved.addListener(function(tabId: number): void {
			if (tabId !== tab.id) {
				return;
			}

			resolve();
			browser.tabs.onRemoved.removeListener(this);
		});
	});
}
