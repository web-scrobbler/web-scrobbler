import { getConnectorFromContentScript } from '../../util/util-connector';
import BaseConnector from '@/core/content/connector';
import * as Util from '@/core/content/util';
import * as MetadataFilter from '@web-scrobbler/metadata-filter';
import start from '@/core/content/starter';
import browser from 'webextension-polyfill';
import { sendContentMessage } from '@/util/communication';
import savedEdits from '../storage/saved-edits';
import regexEdits from '../storage/regex-edits';
import { webhookListenForApproval } from './webhook';
import type { ConnectorMeta } from '../connectors';

main();
async function main() {
	updateTheme();
	try {
		if (
			window.location.href.startsWith('https://webscrobbler.com/webhook')
		) {
			webhookListenForApproval();
			return;
		}
		await bindConnector();
		start();
	} catch (err) {
		if (err instanceof Error && err.message === 'dontlog') {
			return;
		}
		Util.debugLog(err, 'error');
	}
}

/**
 * Find connector that fits current page and bind it.
 * Also, set up window variables for use in connector scripts.
 */
async function bindConnector(): Promise<void> {
	const connector = await getConnectorFromContentScript();
	if (connector) {
		return tryInjectConnector(connector);
	}
}

/**
 * try to bind a specific connector to page.
 * @param connector - connector to bind.
 */
async function tryInjectConnector(connector: ConnectorMeta): Promise<void> {
	// Don't run the connector in frames if it's not allowed to run in frames
	if (window !== top && !connector.allFrames) {
		throw new Error('dontlog');
	}

	window.Connector = new BaseConnector(connector);
	window.Util = Util;
	window.MetadataFilter = MetadataFilter;
	window.webScrobblerScripts = {};
	savedEdits.init();
	regexEdits.init();

	try {
		await import(browser.runtime.getURL(`connectors/${connector?.js}`));
		Util.debugLog(`Successfully loaded ${connector.label} connector`);
	} catch (err) {
		Util.debugLog(
			`An error occured while loading ${connector.label} connector`,
			'error',
		);
		throw err;
	}
}

/**
 * Updates the browser preferred theme in storage for icon theming.
 */
function updateTheme() {
	const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
	sendContentMessage({
		type: 'updateTheme',
		payload: theme,
	});
}
