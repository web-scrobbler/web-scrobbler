'use strict';

/**
 * Module that contains some useful helper functions for background scripts.
 */

define((require) => {
	const browser = require('webextension-polyfill');
	const connectors = require('connectors');

	const STR_REPLACER = 'x';
	const REPLACER_LEN = 5;

	/**
	 * Return platform name.
	 * @return {String} Platform name
	 */
	async function getPlatformName() {
		const platformInfo = await browser.runtime.getPlatformInfo();
		return platformInfo.os;
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
	async function isFullscreenMode() {
		const browserWindow = await browser.windows.getCurrent();
		return browserWindow.state === 'fullscreen';
	}

	/**
	 * Return current tab.
	 * @return {Promise} Promise that will be resolved with current tab object
	 */
	async function getCurrentTab() {
		const query = { active: true, currentWindow: true };
		const tabs = await browser.tabs.query(query);

		return tabs[0];
	}

	/**
	 * Activate tab by given tab ID.
	 * @param {Number} tabId Tab ID
	 */
	function openTab(tabId) {
		browser.tabs.update(tabId, { active: true });
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
