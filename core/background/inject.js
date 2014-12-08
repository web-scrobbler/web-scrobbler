'use strict';
/**
 * Handles matching page URL with defined connectors and injecting scripts into content document
 */
define([
	'connectors',
	'config',
	'objects/injectResult',
	'customPatterns'
], function (connectors, config, injectResult, customPatterns) {

	/**
	 * Creates regex from single match pattern
	 *
	 * @author lacivert
	 * @param {String} input
	 * @returns RegExp
	 */
	function createPattern(input) {
		if (typeof input !== 'string') {
			return null;
		}
		var match_pattern = '^',
			regEscape = function (s) {
				return s.replace(/[[^$.|?*+(){}\\]/g, '\\$&');
			},
			result = /^(\*|https?|file|ftp|chrome-extension):\/\//.exec(input);

		// Parse scheme
		if (!result) {
			return null;
		}
		input = input.substr(result[0].length);
		match_pattern += result[1] === '*' ? 'https?://' : result[1] + '://';

		// Parse host if scheme is not `file`
		if (result[1] !== 'file') {
			if (!(result = /^(?:\*|(\*\.)?([^\/*]+))/.exec(input))) {
				return null;
			}
			input = input.substr(result[0].length);
			if (result[0] === '*') {    // host is '*'
				match_pattern += '[^/]+';
			} else {
				if (result[1]) {         // Subdomain wildcard exists
					match_pattern += '(?:[^/]+\\.)?';
				}
				// Append host (escape special regex characters)
				match_pattern += regEscape(result[2]);// + '/';
			}
		}
		// Add remainder (path)
		match_pattern += input.split('*').map(regEscape).join('.*');
		match_pattern += '$';

		return new RegExp(match_pattern);
	}

	/**
	 * Pings the loaded page and checks if there is already loaded connector. If not injects it.
	 *
	 * @param tabId
	 * @param connector
	 * @param cb
	 */
	function pingAndInject(tabId, connector, cb) {
		// Ping the content page to see if the script is already in place.
		// In the future, connectors will have unified interface, so they will all support
		// the 'ping' request. Right now only YouTube supports this, because it
		// is the only site that uses ajax navigation via History API (which is quite hard to catch).
		// Other connectors will work as usual.
		//
		// Sadly there is no way to silently check if the script has been already injected
		// so we will see an error in the background console on load of every supported page
		chrome.tabs.sendMessage(tabId, {type: 'ping'}, function (response) {
			// if the message was sent to a non existing script or the script
			// does not implement the 'ping' message, we get response==undefined;
			if (!response) {
				console.log('-- loaded for the first time, injecting the scripts');

				// inject all scripts and jQuery, use slice to avoid mutating
				var scripts = connector.js.slice(0);

				// for v2 connectors prepend BaseConnector, newer jQuery (!) and append starter
				if (typeof(connector.version) != 'undefined' && connector.version === 2) {
					scripts.unshift('core/content/connector.js');
					scripts.unshift('core/content/reactor.js');
					scripts.unshift('vendor/underscore-min.js');
					scripts.unshift(config.JQUERY_PATH);

					scripts.push('core/content/starter.js'); // needs to be the last script injected
				}
				// for older connectors prepend older jQuery as a first loaded script
				else {
					scripts.unshift(config.JQUERY_1_6_PATH);
				}

				// waits for script to be fully injected before injecting another one
				var injectWorker = function () {
					if (scripts.length > 0) {
						var jsFile = scripts.shift();
						var injectDetails = {
							file: jsFile,
							allFrames: connector.allFrames ? connector.allFrames : false
						};

						console.log('\tinjecting ' + jsFile);
						chrome.tabs.executeScript(tabId, injectDetails, injectWorker);
					}
					else {
						// done successfully
						cb(new injectResult.InjectResult(injectResult.results.MATCHED_AND_INJECTED, tabId, connector));
					}
				};

				injectWorker();
			}
			else {
				// no cb() call, useless to report this state
				console.log('-- subsequent ajax navigation, the scripts are already injected');
			}
		});
	}

	/**
	 * Is triggered by chrome.tabs.onUpdated event
	 * Checks for available connectors and injects matching connector into loaded page
	 * while returning info about the connector
	 *
	 * @param {Number} tabId
	 * @param {Object} changeInfo
	 * @param {Object} tab
	 * @param {Function} cb to be called to signalize the state of injecting
	 */
	function onTabsUpdated(tabId, changeInfo, tab, cb) {
		var onPatternsReady = function(customPatterns) {
			// run first available connector
			var anyMatch = !connectors.every(function (connector) {
				var matchOk = false,
					patterns = connector.matches;

				// if there are custom patterns use only them, otherwise use only predefined patterns
				if (customPatterns.hasOwnProperty(connector.label) && customPatterns[connector.label].length > 0) {
					patterns = customPatterns[connector.label];
				}

				patterns.forEach(function (match) {
					matchOk = matchOk || createPattern(match).test(tab.url);
				});

				if (matchOk === true) {
					if (!config.isConnectorEnabled(connector.label)) {
						// matched, but is not enabled
						cb(new injectResult.InjectResult(injectResult.results.MATCHED_BUT_DISABLED, tabId, connector));

						return false; // break forEach connector
					}

					// checks if there's already injected connector and injects it if needed
					pingAndInject(tabId, connector, cb);
				}

				return !matchOk;
			});

			// report no match
			if (!anyMatch) {
				cb(new injectResult.InjectResult(injectResult.results.NO_MATCH, tabId, null));
			}
		};

		// asynchronously preload all custom patterns and then start matching
		customPatterns.getAllPatterns(onPatternsReady);
	}


	return {
		onTabsUpdated: onTabsUpdated
	};

});
