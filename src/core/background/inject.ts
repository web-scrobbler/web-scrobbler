import { getConnectorByUrl } from '@/util/util-connector';
import browser from 'webextension-polyfill';
import { sendBackgroundMessage } from '@/util/communication';

/**
 * Attempts to inject the connector into the page.
 *
 * @param tab - The tab to inject the connector into
 * @returns A promise that resolves when the connector is injected
 */
async function updateTab(tab: browser.Tabs.Tab) {
	if (typeof tab.id === 'undefined') {
		throw new Error('Could not identify tab: ' + tab);
	}

	let url = tab.url;
	if (typeof url === 'undefined') {
		url = await browser.tabs.get(tab.id).then((idTab) => idTab.url);
	}
	if (typeof url === 'undefined') {
		throw new Error('Could not identify URL of tab: ' + tab);
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

	if (await isConnectorInjected(tabId)) {
		return;
	}

	try {
		return injectScripts(tabId);
	} catch (err) {
		if (err instanceof Error) {
			console.warn(err.message);
		}
	}
}

/**
 * Inject content script into a tab.
 *
 * @param tabId - The tab to inject the script into
 */
async function injectScripts(tabId: number) {
	const script = 'content/main.js';
	await browser.scripting.executeScript({
		target: { tabId },
		files: [script],
	});
}

/**
 * Checks if a connector is already injected into a tab
 *
 * @param tabId - The tab to check
 * @returns true if the connector is injected, false otherwise
 */
async function isConnectorInjected(tabId: number) {
	// Ping the content page to see if the script is already in place.
	try {
		await sendBackgroundMessage(tabId, {
			type: 'ping',
			payload: undefined,
		});
		return true;
	} catch (e) {
		return false;
	}
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
			await updateTab(tab);
		} catch (err) {
			console.warn('Error while injecting into tab: ', err);
		}
	}
}
