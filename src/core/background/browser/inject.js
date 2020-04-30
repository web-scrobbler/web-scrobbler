'use strict';
/**
 * Handles matching page URL with defined connectors and injecting scripts into content document
 */
define((require) => {
	const browser = require('webextension-polyfill');
	const { INJECTED, MATCHED, NO_MATCH } = require('object/inject-result');

	const CONTENT_SCRIPTS = [
		'vendor/filter.js',
		'vendor/browser-polyfill.min.js',
		'core/content/util.js',
		'core/content/reactor.js',
		'core/content/connector.js',
	];
	const STARTER_SCRIPT = 'core/content/starter.js';

	/**
	 * Ping the loaded page and checks if there is already loaded connector.
	 *
	 * @param {Number} tabId Tab ID
	 *
	 * @return {Boolean} Check result
	 */
	async function isConnectorInjected(tabId) {
		// Ping the content page to see if the script is already in place.
		try {
			await browser.tabs.sendMessage(tabId, { type: 'EVENT_PING' });
			return true;
		} catch (e) {
			return false;
		}
	}

	/**
	 * Inject content scripts into the page.
	 *
	 * @param {Number} tabId Tab ID
	 * @param {Object} connector Connector match object
	 *
	 * @return {Object} InjectResult value
	 */
	async function injectScripts(tabId, connector) {
		const scripts = [
			...CONTENT_SCRIPTS, connector.js, STARTER_SCRIPT,
		];

		for (const file of scripts) {
			const allFrames = connector.allFrames || false;

			console.log(`Injecting ${file}`);
			/* @ifdef FIREFOX
			try {
			/* @endif */
			await browser.tabs.executeScript(tabId, { file, allFrames });
			/* @ifdef FIREFOX
			} catch (e) {
				// Firefox throws an error if a content script returns no value.
				console.error(e);
			}
			/* @endif */
		}

		return MATCHED;
	}

	/**
	 * Inject a matching connector into a page.
	 *
	 * @param  {Number} tabId An ID of a tab where the connector will be injected
	 * @param  {String} connector Connector match object
	 *
	 * @return {Object} InjectResult value
	 */
	async function injectConnector(tabId, connector) {
		if (!connector) {
			return NO_MATCH;
		}

		if (await isConnectorInjected(tabId)) {
			return INJECTED;
		}

		try {
			return injectScripts(tabId, connector);
		} catch (err) {
			console.warn(err.message);
			return NO_MATCH;
		}
	}

	return { injectConnector };
});
