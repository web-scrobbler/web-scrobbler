'use strict';

/**
 * Module that contains some useful helper functions for background scripts.
 */

define((require) => {
	const chrome = require('wrapper/chrome');
	const connectors = require('connectors');

	const STR_REPLACER = 'x';
	const REPLACER_LEN = 5;

	/**
	 * Return platform name using Chrome API.
	 * @return {Promise} Promise that will be resolved with platform name
	 */
	function getPlatformName() {
		return new Promise((resolve) => {
			chrome.runtime.getPlatformInfo((info) => {
				resolve(info.os);
			});
		});
	}

	/**
	 * Partial hide string in given text.
	 * @param  {String} str String to be hidden
	 * @param  {String} text Text
	 * @return {String} Modified text
	 */
	function hideStringInText(str, text) {
		if (str && text) {
			let replacer = STR_REPLACER.repeat(Math.min(REPLACER_LEN, text.length));
			return text.replace(str,
				`${replacer}${str.substr(replacer.length)}`
			);
		}
		return text;
	}

	/**
	 * Partial hide string in given text.
	 * @param  {String} str String to be hidden
	 * @return {String} Modified string
	 */
	function hideString(str) {
		if (str) {
			let replacer = STR_REPLACER.repeat(Math.min(REPLACER_LEN, str.length));
			return `${replacer}${str.substr(replacer.length)}`;
		}
		return str;
	}


	/**
	 * Check if browser is in fullscreen mode.
	 * @return {Promise} Promise that will be resolved with check result
	 */
	function isFullscreenMode() {
		return new Promise((resolve) => {
			chrome.windows.getCurrent((chromeWindow) => {
				resolve(chromeWindow.state === 'fullscreen');
			});
		});
	}

	/**
	 * Return current tab.
	 * @return {Promise} Promise that will be resolved with current tab object
	 */
	function getCurrentTab() {
		return new Promise((resolve) => {
			let query = { active: true, lastFocusedWindow: true };
			chrome.tabs.query(query, (tabs) => {
				resolve(tabs[0]);
			});
		});
	}

	/**
	 * Activate tab by given tab ID.
	 * @param {Number} tabId Tab ID
	 */
	function openTab(tabId) {
		chrome.tabs.update(tabId, { active: true });
	}

	/**
	 * Execute promise with specified timeout.
	 * @param  {Number} timeout Timeout in milliseconds
	 * @param  {Promise} promise Promise to execute
	 * @return {Promise} Promise that will be resolved when the task has complete
	 */
	function timeoutPromise(timeout, promise) {
		return new Promise((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				reject(new Error('promise timeout'));
			}, timeout);
			promise.then(
				(res) => {
					clearTimeout(timeoutId);
					resolve(res);
				},
				(err) => {
					clearTimeout(timeoutId);
					reject(err);
				}
			);
		});
	}

	/**
	 * Return a sorted array of connectors.
	 * @return {Array} Array of connectors
	 */
	function getSortedConnectors() {
		return connectors.slice(0).sort((a, b) => {
			return a.label.localeCompare(b.label);
		});
	}

	/**
	 * Print debug message.
	 * @param  {String} text Debug message
	 * @param  {String} logType Log type
	 */
	function debugLog(text, logType = 'log') {
		const logFunc = console[logType];

		if (typeof(logFunc) !== 'function') {
			throw new Error(`Unknown log type: ${logType}`);
		}

		logFunc(text);
	}

	return {
		debugLog, getCurrentTab, timeoutPromise, getPlatformName, openTab,
		hideString, hideStringInText, isFullscreenMode, getSortedConnectors,
	};
});
