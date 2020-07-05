import { runtime, tabs, windows } from 'webextension-polyfill';

import { L } from '@/common/i18n';

/**
 * Filename of privacy policy document.
 */
const PRIVACY_FILENAME = 'privacy.md';

/**
 * Location of default privacy policy document.
 */
const DEFAULT_PRIVACY_PATH = `_locales/en/${PRIVACY_FILENAME}`;

/**
 * Create query string from object properties.
 *
 * @param {Object} params Object contains query parameters
 */
export function createQueryString(params) {
	const parts = [];

	for (const x in params) {
		parts.push(`${x}=${encodeURIComponent(params[x])}`);
	}

	return parts.join('&');
}

/**
 * Return current tab.
 *
 * @return {Promise} Promise that will be resolved with current tab object
 */
export async function getCurrentTab() {
	const query = { active: true, currentWindow: true };

	return (await tabs.query(query))[0];
}

/**
 * Return platform name.
 *
 * @return {String} Platform name
 */
export async function getPlatformName() {
	const platformInfo = await runtime.getPlatformInfo();
	return platformInfo.os;
}

/**
 * Get URL of privacy policy document.
 *
 * @return {String} privacy policy URL
 */
export async function getPrivacyPolicyFilename() {
	const locale = L('@@ui_locale');
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
 * Check if browser is in fullscreen mode.
 *
 * @return {Promise} Promise that will be resolved with check result
 */
export async function isFullscreenMode() {
	const browserWindow = await windows.getCurrent();
	return browserWindow.state === 'fullscreen';
}

/**
 * Activate tab by given tab ID.
 *
 * @param {Number} tabId Tab ID
 */
export function openTab(tabId) {
	tabs.update(tabId, { active: true });
}

/**
 * Check if an extension resource file exists.
 *
 * @param {String} fileName Filename to check
 *
 * @return {Boolean} Check result
 */
async function isFileExists(fileName) {
	const fileUrl = runtime.getURL(fileName);
	const response = await fetch(fileUrl);

	return response.status === 200;
}
