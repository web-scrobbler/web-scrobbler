'use strict';

/**
 * Module that contains some useful helper functions for background scripts.
 */

define((require) => {
	const browser = require('webextension-polyfill');
	const connectors = require('connectors');

	const STR_REPLACER = '*';
	const HIDDEN_PLACEHOLDER = '[hidden]';

	/**
	 * Number of seconds of playback before the track is scrobbled.
	 * This value is used only if no duration was parsed or loaded.
	 */
	const DEFAULT_SCROBBLE_TIME = 30;

	/**
	 * Minimum number of seconds of scrobbleable track.
	 */
	const MIN_TRACK_DURATION = 30;

	/**
	 * Max number of seconds of playback before the track is scrobbled.
	 */
	const MAX_SCROBBLE_TIME = 240;

	/**
	 * Percentage of song duration to scrobble.
	 */
	const SCROBBLE_PERCENTAGE = 50;

	/**
	 * Filename of privacy policy document.
	 * @type {String}
	 */
	const PRIVACY_FILENAME = 'privacy.md';

	/**
	 * Location of default privacy policy document.
	 * @type {String}
	 */
	const DEFAULT_PRIVACY_PATH = `_locales/en/${PRIVACY_FILENAME}`;

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
			const replacer = STR_REPLACER.repeat(str.length);
			return text.replace(str, replacer);
		}
		return text;
	}

	/**
	 * Get hidden string representation of given object.
	 * @param  {String} keyValue Value to be hidden
	 * @return {String} Modified string
	 */
	function hideObjectValue(keyValue) {
		if (!keyValue) {
			return keyValue;
		}

		if (typeof(keyValue) === 'string') {
			return STR_REPLACER.repeat(keyValue.length);
		} else if (Array.isArray(keyValue)) {
			return `[Array(${keyValue.length})]`;
		}

		return HIDDEN_PLACEHOLDER;
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

	/**
	 * Return total number of seconds of playback needed for this track
	 * to be scrobbled.
	 * @param  {Number} duration Song duration
	 * @return {Number} Seconds to scrobble
	 */
	function getSecondsToScrobble(duration) {
		if (isDurationInvalid(duration)) {
			return DEFAULT_SCROBBLE_TIME;
		}

		if (duration < MIN_TRACK_DURATION) {
			return -1;
		}

		const scrobbleTime = Math.round(duration * SCROBBLE_PERCENTAGE / 100);
		return Math.min(scrobbleTime, MAX_SCROBBLE_TIME);
	}

	/**
	 * Check if duration is not a valid number.
	 * @param  {Object}  duration Duration in seconds
	 * @return {Boolean} Check result
	 */
	function isDurationInvalid(duration) {
		return !duration || typeof duration !== 'number' ||
			isNaN(duration) || !isFinite(duration);
	}

	/**
	 * Check if an extension resource file exists.
	 * @param  {String} fileName Filename to check
	 * @return {Boolean} Check result
	 */
	async function isFileExists(fileName) {
		const fileUrl = browser.runtime.getURL(fileName);
		const response = await fetch(fileUrl);

		return response.status === 200;
	}

	/**
	 * Get URL of privacy policy document.
	 * @return {String} privacy policy URL
	 */
	async function getPrivacyPolicyFilename() {
		const locale = browser.i18n.getMessage('@@ui_locale');
		const privacyFilenames = [DEFAULT_PRIVACY_PATH];

		if (!locale.startsWith('en')) {
			const language = locale.split('_')[0];

			privacyFilenames.unshift(`_locales/${language}/${PRIVACY_FILENAME}`);
			privacyFilenames.unshift(`_locales/${locale}/${PRIVACY_FILENAME}`);
		}

		for (let privacyFilename of privacyFilenames) {
			if (await isFileExists(privacyFilename)) {
				return privacyFilename;
			}
		}

		throw new Error('Found no privacy policy documents!');
	}

	/**
	 * Create query string from object properties.
	 * @param {Array} params Object contains query parameters
	 */
	function createQueryString(params) {
		const parts = [];

		for (const x in params) {
			parts.push(`${x}=${encodeURIComponent(params[x])}`);
		}

		return parts.join('&');
	}

	return {
		debugLog, getCurrentTab, timeoutPromise, getPlatformName, openTab,
		hideObjectValue, hideStringInText, isFullscreenMode, getSortedConnectors,
		getSecondsToScrobble, getPrivacyPolicyFilename, createQueryString,

		MIN_TRACK_DURATION, DEFAULT_SCROBBLE_TIME, MAX_SCROBBLE_TIME,

		HIDDEN_PLACEHOLDER
	};
});
