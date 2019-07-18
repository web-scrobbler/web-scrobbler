'use strict';
/**
 * Handles matching page URL with defined connectors and injecting scripts into content document
 */
define((require) => {
	const browser = require('webextension-polyfill');
	const Options = require('storage/options');
	const UrlMatch = require('util/url-match');
	const connectors = require('connectors');
	const InjectResult = require('object/inject-result');
	const CustomPatterns = require('storage/custom-patterns');

	const CONTENT_SCRIPTS = [
		'vendor/jquery.min.js',
		'vendor/browser-polyfill.min.js',
		'core/content/util.js',
		'core/content/reactor.js',
		'core/content/filter.js',
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
			...CONTENT_SCRIPTS, ...connector.js, STARTER_SCRIPT
		];

		for (const file of scripts) {
			const allFrames = connector.allFrames || false;

			console.log(`Injecting ${file}`);
			try {
				await browser.tabs.executeScript(tabId, { file, allFrames });
			} catch (e) {
				// Firefox throws an error if a content script returns no value.
				console.error(e);
			}
		}

		const isEnabled = await Options.isConnectorEnabled(connector.label);
		if (isEnabled) {
			return new InjectResult(
				InjectResult.MATCHED_AND_INJECTED, connector);
		}

		return new InjectResult(InjectResult.MATCHED_BUT_DISABLED, connector);
	}

	/**
	 * Is triggered by browser.tabs.onUpdated event
	 * Check for available connectors and injects matching connector into
	 * loaded page while returning info about the connector.
	 *
	 * @param  {Object} tab Tab object
	 * @return {Object} InjectResult value
	 */
	async function onTabsUpdated(tab) {
		// Asynchronously preload all custom patterns and then start matching
		let customPatterns = await CustomPatterns.getAllPatterns();
		for (let connector of connectors) {
			let patterns = connector.matches || [];

			if (customPatterns[connector.label]) {
				patterns = patterns.concat(customPatterns[connector.label]);
			}

			for (let pattern of patterns) {
				if (UrlMatch.test(tab.url, pattern)) {
					if (await isConnectorInjected(tab.id)) {
						return new InjectResult(InjectResult.ALREADY_INJECTED, connector);
					}

					return injectScripts(tab.id, connector);
				}
			}
		}

		return new InjectResult(InjectResult.NO_MATCH, null);
	}

	return { onTabsUpdated };
});
