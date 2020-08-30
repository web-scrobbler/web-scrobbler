import { browser } from 'webextension-polyfill-ts';

import { ConnectorEntry } from '@/common/connector-entry';
import { Request, sendMessageToContentScripts } from '@/common/messages';

const contentScripts = [
	'/vendor/filter.js',
	'/content/util.js',
	'/content/reactor.js',
	'/content/connector.js',
];
const starterScript = 'content/starter.js';

export enum InjectResult {
	/**
	 * All content scripts are already injected.
	 */
	Injected,

	/**
	 * The connector is matched and all content scripts are injected.
	 */
	Matched,

	/**
	 * The connector is not matched.
	 */
	NoMatch,
}

/**
 * Inject a matching connector into a page.
 *
 * @param tabId An ID of a tab where the connector will be injected
 * @param connector Connector entry
 *
 * @return InjectResult value
 */
export async function injectConnector(
	tabId: number,
	connector: ConnectorEntry
): Promise<InjectResult> {
	if (!connector) {
		return InjectResult.NoMatch;
	}

	if (await isConnectorInjected(tabId)) {
		return InjectResult.Injected;
	}

	try {
		return injectScripts(tabId, connector.js, {
			allFrames: connector.allFrames || false,
		});
	} catch (err) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		console.warn(err.message);
		return InjectResult.NoMatch;
	}
}

/**
 * Ping the loaded page and check if there is already injected connector.
 *
 * @param tabId Tab ID
 *
 * @return Check result
 */
async function isConnectorInjected(tabId: number): Promise<boolean> {
	// Ping the content page to see if the script is already in place.
	try {
		await sendMessageToContentScripts(tabId, Request.Ping);
		return true;
	} catch (e) {
		return false;
	}
}

/**
 * Inject content scripts into the page.
 *
 * @param tabId Tab ID
 * @param connectorScript Path to the connector file
 * @param options Options
 * @param options.allFrames Allow/disallow injecting the connector into all frames
 *
 * @return InjectResult value
 */
async function injectScripts(
	tabId: number,
	connectorScript: string,
	{ allFrames = false } = {}
): Promise<InjectResult> {
	// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/executeScript
	const scripts = [...contentScripts, `/${connectorScript}`, starterScript];

	for (const file of scripts) {
		try {
			await browser.tabs.executeScript(tabId, { file, allFrames });

			console.log(`Injected ${file}`);
		} catch (e) {
			// Firefox throws an error if a content script returns no value,
			// so we should catch it, and continue injecting scripts.

			console.warn(`Unable to inject ${file}: ${(e as Error).message}`);
		}
	}

	return InjectResult.Matched;
}
