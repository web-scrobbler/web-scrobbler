'use strict';

/**
 * Module that contains some useful helper functions for background scripts.
 */

define(['wrappers/chrome'], (chrome) => {
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
	 * Partiall hide string in given text.
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
	 * Return curent tab.
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
	 * Run given promises sequentially.
	 * @param  {Array} factories Array of function return promises
	 * @param  {Any} args Arguments applied to each factory function
	 * @return {Promise} Promise that will be resolved when all tasks have complete
	 */
	function queuePromises(factories, ...args) {
		let promiseSequence = Promise.resolve();
		for (let func of factories) {
			promiseSequence = promiseSequence.then(() => {
				return func(...args);
			});
		}

		return promiseSequence;
	}

	return {
		getCurrentTab, timeoutPromise, getPlatformName,
		hideStringInText, isFullscreenMode, queuePromises
	};
});
