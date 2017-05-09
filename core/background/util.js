'use strict';

/**
 * Module that contains some useful helper functions for background scripts.
 */

define(['wrappers/chrome'], (chrome) => {
	const STR_REPLACER = 'xxxxx';

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
		if (str) {
			// FIXME: check if length of str is lower than replacer length.
			return text.replace(str,
				`${STR_REPLACER}${str.substr(STR_REPLACER.length)}`
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

	return {
		getCurrentTab, getPlatformName,	hideStringInText, isFullscreenMode
	};
});
