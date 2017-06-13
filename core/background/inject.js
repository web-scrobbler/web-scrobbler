'use strict';
/**
 * Handles matching page URL with defined connectors and injecting scripts into content document
 */
define([
	'connectors',
	'config',
	'objects/injectResult',
	'customPatterns',
	'url-match'
], function (connectors, config, InjectResult, customPatterns, UrlMatch) {
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
				// if the message was sent to a non existing script or the script
				// does not implement the 'ping' message, we get response==undefined;
				if (!response) {
					console.log('-- loaded for the first time, injecting the scripts');

					// inject all scripts and jQuery, use slice to avoid mutating
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

							console.log('\tinjecting ' + jsFile);
							chrome.tabs.executeScript(tabId, injectDetails, injectWorker);
						} else {
							// done successfully
							resolve(new InjectResult(InjectResult.MATCHED_AND_INJECTED, tabId, connector));
						}
					}

					injectWorker();
				} else {
					console.log('-- subsequent ajax navigation, the scripts are already injected');
					resolve(null);
				}
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
		return customPatterns.getAllPatterns().then((customPatterns) => {
			for (let connector of connectors) {
				let matchOk = false;
				let patterns = connector.matches || [];

				if (customPatterns[connector.label]) {
					patterns.concat(customPatterns[connector.label]);
				}

				patterns.forEach(function (match) {
					matchOk = matchOk || UrlMatch.test(tab.url, match);
				});

				if (matchOk) {
					if (!config.isConnectorEnabled(connector.label)) {
						return new InjectResult(InjectResult.MATCHED_BUT_DISABLED, tab.id, connector);
					}

					// Checks if there's already injected connector
					// and injects it if needed
					return pingAndInject(tab.id, connector);
				}
			}

			return new InjectResult(InjectResult.NO_MATCH, tab.id, null);
		});
	}

	return { onTabsUpdated };
});
