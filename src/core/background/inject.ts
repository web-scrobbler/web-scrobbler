import browser from 'webextension-polyfill';

/**
 * Attempts to inject the connector into the page.
 *
 * Function does not wait for injection to finish, because it can hang if the tab is asleep.
 *
 * @param tab - The tab to inject the connector into
 * @returns A promise that resolves when the connector is being injected.
 */
function attemptInjectTab(tab: browser.Tabs.Tab) {
	if (typeof tab.id === 'undefined') {
		throw new Error(`Could not identify tab: ${JSON.stringify(tab)}`);
	}

	const script = 'content/main.js';
	browser.scripting.executeScript({
		target: { tabId: tab.id },
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
			attemptInjectTab(tab);
		} catch (err) {
			console.warn('Error while injecting into tab: ', err);
		}
	}
}
