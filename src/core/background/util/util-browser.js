'use strict';

define((require) => {
	const browser = require('webextension-polyfill');

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
	 * Return platform name.
	 * @return {String} Platform name
	 */
	async function getPlatformName() {
		const platformInfo = await browser.runtime.getPlatformInfo();
		return platformInfo.os;
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

		for (const privacyFilename of privacyFilenames) {
			if (await isFileExists(privacyFilename)) {
				return privacyFilename;
			}
		}

		throw new Error('Found no privacy policy documents!');
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
	 * Check if browser is in fullscreen mode.
	 * @return {Promise} Promise that will be resolved with check result
	 */
	async function isFullscreenMode() {
		const browserWindow = await browser.windows.getCurrent();
		return browserWindow.state === 'fullscreen';
	}

	/**
	 * Activate tab by given tab ID.
	 * @param {Number} tabId Tab ID
	 */
	function openTab(tabId) {
		browser.tabs.update(tabId, { active: true });
	}

	/**
	 * Get the version of the extension.
	 *
	 * @return {String} the extension version
	 */
	function getExtensionVersion() {
		return browser.runtime.getManifest().version;
	}

	return {
		createQueryString,
		getCurrentTab,
		getPlatformName,
		getPrivacyPolicyFilename,
		isFullscreenMode,
		openTab,
		getExtensionVersion,
	};
});
