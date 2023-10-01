import { getConnectorByUrl } from '@/util/util-connector';
import browser from 'webextension-polyfill';

/**
 * Attempts to inject the connector into the page.
 *
 * Function does not wait for injection to finish, because it can hang if the tab is asleep.
 *
 * @param tab - The tab to inject the connector into
 * @returns A promise that resolves when the connector is being injected.
 */
async function attemptInjectTab(tab: browser.Tabs.Tab) {
	if (typeof tab.id === 'undefined') {
		throw new Error(`Could not identify tab: ${JSON.stringify(tab)}`);
	}

	let url = tab.url;
	if (typeof url === 'undefined') {
		url = await browser.tabs.get(tab.id).then((idTab) => idTab.url);
	}
	if (typeof url === 'undefined') {
		throw new Error(
			`Could not identify URL of tab: ${JSON.stringify(tab)}`,
		);
	}

	return injectConnector(tab.id, url);
}

/**
 * Does the actual injection attempt after checking for missing properties.
 *
 * @param tabId - The tab to inject the connector into
 * @param url - The URL of the tab
 * @returns A promise that resolves when the connector is injected
 */
async function injectConnector(tabId: number, url: string) {
	const connector = await getConnectorByUrl(url);

	if (!connector) {
		return;
	}

	/**
	 * Important note: We do not check if the script already exists here.
	 * As scripts are always invalidated on reload, and this only runs on install, there is no need.
	 */

	const script = 'content/main.js';
	browser.scripting.executeScript({
		target: { tabId },
		files: [script],
	});
}

/**
 * Attempts to inject content script into all tabs.
 * Ran on extension load, as whenever the extension is updated or reloaded
 * all content scripts are invalidated and stop working.
 * So we need to replace them.
 */
export async function attemptInjectAllTabs() {
	const tabs = await browser.tabs?.query({});
	for (const tab of tabs ?? []) {
		try {
			await attemptInjectTab(tab);
		} catch (err) {
			console.warn('Error while injecting into tab: ', err);
		}
	}
}
