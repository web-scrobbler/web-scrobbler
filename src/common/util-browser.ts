import { browser, Tabs } from 'webextension-polyfill-ts';

import { L } from '@/common/i18n';
import { AudioScrobblerApiParams } from '@/background/scrobbler/audio-scrobbler';

/**
 * Filename of a privacy policy document.
 */
const privacyFileName = 'privacy.md';

/**
 * Location of the default privacy policy document.
 */
const defaultPrivacyPath = `_locales/en/${privacyFileName}`;

/**
 * Create a query string from object properties.
 *
 * @param params Object contains query parameters
 *
 * @return Query string
 */
export function createQueryString(params: AudioScrobblerApiParams): string {
	const parts = [];

	for (const x in params) {
		parts.push(`${x}=${encodeURIComponent(params[x])}`);
	}

	return parts.join('&');
}

/**
 * Return the current tab.
 *
 * @return Tab object
 */
export async function getCurrentTab(): Promise<Tabs.Tab> {
	const query = { active: true, currentWindow: true };

	return (await browser.tabs.query(query))[0];
}

/**
 * Return the platform name.
 *
 * @return Platform name
 */
export async function getPlatformName(): Promise<string> {
	const platformInfo = await browser.runtime.getPlatformInfo();
	return platformInfo.os;
}

/**
 * Get an URL of the privacy policy document.
 *
 * @return Privacy policy URL
 */
export async function getPrivacyPolicyFilename(): Promise<string> {
	const locale = L`@@ui_locale`;
	const privacyFilenames = [defaultPrivacyPath];

	if (!locale.startsWith('en')) {
		const language = locale.split('_')[0];

		privacyFilenames.unshift(`_locales/${language}/${privacyFileName}`);
		privacyFilenames.unshift(`_locales/${locale}/${privacyFileName}`);
	}

	for (const privacyFilename of privacyFilenames) {
		if (await isFileExists(privacyFilename)) {
			return privacyFilename;
		}
	}

	throw new Error('Found no privacy policy documents!');
}

export async function isBackgroundScript(): Promise<boolean> {
	const backgroundPage = await browser.runtime.getBackgroundPage();
	return backgroundPage === window;
}

/**
 * Check if the browser is in fullscreen mode.
 *
 * @return Check result
 */
export async function isFullscreenMode(): Promise<boolean> {
	const browserWindow = await browser.windows.getCurrent();
	return browserWindow.state === 'fullscreen';
}

/**
 * Activate a tab by a given tab ID.
 *
 * @param tabId Tab ID
 */
export function openTab(tabId: number): void {
	browser.tabs.update(tabId, { active: true });
}

/**
 * Check if an extension resource file exists.
 *
 * @param fileName Filename to check
 *
 * @return Check result
 */
async function isFileExists(fileName: string): Promise<boolean> {
	const fileUrl = browser.runtime.getURL(fileName);
	const response = await fetch(fileUrl);

	return response.status === 200;
}
