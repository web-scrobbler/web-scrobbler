'use strict';
/**
 * Handles matching page URL with defined connectors and injecting scripts into content document
 */
define((require) => {
	const Config = require('config');
	const UrlMatch = require('url-match');
	const connectors = require('connectors');
	const InjectResult = require('objects/injectResult');
	const CustomPatterns = require('customPatterns');

	/**
	 * Ping the loaded page and checks if there is already loaded connector.
	 * If not injects it.
	 *
	 * @param {Number} tabId Tab ID
	 * @param {Object} connector Connector match objects
	 *
	 * @return {Promise} Promise that will be resolved with InjectResult value
	 */
	function pingAndInject(tabId, connector) {
		/*
		 * Ping the content page to see if the script is already in place.
		 *
		 * Sadly there is no way to silently check if the script has been
		 * already injected, so we will see an error in the background console
		 * on load of every supported page.
		 */
		return new Promise((resolve) => {
			chrome.tabs.sendMessage(tabId, { type: 'v2.onPing' }, (response) => {
				if (response) {
					console.log('Subsequent ajax navigation, the scripts are already injected');
					resolve(new InjectResult(InjectResult.ALREADY_INJECTED, connector));
					return;
				}

				console.log('Loaded for the first time, injecting the scripts');

				// Inject all scripts and jQuery, use slice to avoid mutating
				let scripts = connector.js.slice(0);

				scripts.unshift('core/content/connector.js');
				scripts.unshift('core/content/util.js');
				scripts.unshift('core/content/filter.js');
				scripts.unshift('core/content/reactor.js');
				// @ifdef DEBUG
				scripts.unshift('core/content/testReporter.js');
				// @endif
				scripts.unshift('vendor/jquery.min.js');

				// Needs to be the last script injected
				scripts.push('core/content/starter.js');

				// Waits for script to be fully injected before
				// injecting another one
				function injectWorker() {
					if (scripts.length > 0) {
						let jsFile = scripts.shift();
						let injectDetails = {
							file: jsFile,
							allFrames: connector.allFrames ? connector.allFrames : false
						};

						console.log(`Injecting ${jsFile}`);
						chrome.tabs.executeScript(tabId, injectDetails, injectWorker);
					} else {
						Config.isConnectorEnabled(connector.label).then((isEnabled) => {
							if (!isEnabled) {
								resolve(new InjectResult(InjectResult.MATCHED_BUT_DISABLED, connector));
							} else {
								resolve(new InjectResult(InjectResult.MATCHED_AND_INJECTED, connector));
							}
						});
					}
				}

				injectWorker();
			});
		});
	}

	/**
	 * Is triggered by chrome.tabs.onUpdated event
	 * Check for available connectors and injects matching connector into
	 * loaded page while returning info about the connector.
	 *
	 * @param {Object} tab Tab object
	 * @return {Promise} Promise that will be resolved with InjectResult value
	 */
	function onTabsUpdated(tab) {
		// Asynchronously preload all custom patterns and then start matching
		return CustomPatterns.getAllPatterns().then((customPatterns) => {
			for (let connector of connectors) {
				let matchOk = false;
				let patterns = connector.matches || [];

				if (customPatterns[connector.label]) {
					patterns = patterns.concat(customPatterns[connector.label]);
				}

				for (let pattern of patterns) {
					matchOk = matchOk || UrlMatch.test(tab.url, pattern);
				}

				if (matchOk) {
					// Checks if there's already injected connector
					// and injects it if needed
					return pingAndInject(tab.id, connector);

				}
			}

			return new InjectResult(InjectResult.NO_MATCH, null);
		});
	}

	return { onTabsUpdated };
});
