import { browser } from 'webextension-polyfill-ts';

import { ConnectorEntry } from '@/common/connector-entry';
import { Request, sendMessageToContentScripts } from '@/common/messages';

const contentScripts = [
	'vendor/filter.js',
	'content/util.js',
	'content/reactor.js',
	'content/connector.js',
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
		return injectScripts(tabId, connector);
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
 * @param connector Connector entry
 *
 * @return InjectResult value
 */
async function injectScripts(
	tabId: number,
	connector: ConnectorEntry
): Promise<InjectResult> {
	const scripts = [...contentScripts, connector.js, starterScript];

	for (const file of scripts) {
		const allFrames = connector.allFrames || false;

		console.log(`Injecting ${file}`);
		/* @ifdef FIREFOX **
		try {
		/* @endif */
		await browser.tabs.executeScript(tabId, { file, allFrames });
		/* @ifdef FIREFOX **
		} catch (e) {
			// Firefox throws an error if a content script returns no value.
			console.error(e);
		}
		/* @endif */
	}

	return InjectResult.Matched;
}
