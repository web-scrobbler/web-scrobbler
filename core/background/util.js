'use strict';

/**
 * Module that contains some useful helper functions for background scripts.
 */

define(['wrappers/chrome'], (chrome) => {
	const STR_REPLACER = 'xxxxx';

	/**
	 * Get current time in hh:mm am/pm format.
	 * @return {String} Formatted time string
	 */
	function getCurrentTime() {
		let date = new Date();

		let hours = date.getHours();
		let minutes = date.getMinutes();
		let ampm = hours >= 12 ? 'pm' : 'am';

		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;

		return `${hours}:${minutes}${ampm}`;
	}

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

	return {
		getCurrentTime, getPlatformName,
		hideStringInText, isFullscreenMode
	};
});
