import browser from 'webextension-polyfill';

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
 * @param params - Object contains query parameters
 */
export function createQueryString(
	params: Record<string, string | null | undefined | number>,
): string {
	const preparedParams = Object.entries(params).reduce(
		(acc, [key, value]) => {
			if (typeof value === 'string') {
				acc[key] = value;
			} else if (typeof value === 'number') {
				acc[key] = value.toString();
			} else if (typeof value === 'undefined' || value === null) {
				acc[key] = '';
			}

			return acc;
		},
		{} as Record<string, string>,
	);

	return new URLSearchParams(preparedParams).toString();
}

/**
 * Return platform name.
 * @returns Platform name
 */
export async function getPlatformName(): Promise<browser.Runtime.PlatformOs> {
	const platformInfo = await browser.runtime.getPlatformInfo();
	return platformInfo.os;
}

/**
 * Get URL of privacy policy document.
 * @returns privacy policy URL
 */
export async function getPrivacyPolicyFilename(): Promise<string> {
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
 * @param fileName - Filename to check
 * @returns Check result
 */
async function isFileExists(fileName: string) {
	const fileUrl = browser.runtime.getURL(fileName);
	const response = await fetch(fileUrl);

	return response.status === 200;
}

/**
 * Check if browser is in fullscreen mode.
 * @returns Promise that will be resolved with check result
 */
export async function isFullscreenMode(): Promise<boolean> {
	const browserWindow = await browser.windows.getCurrent();
	return browserWindow.state === 'fullscreen';
}

/**
 * Activate tab by given tab ID.
 * @param tabId - Tab ID
 */
export function openTab(tabId: number): void {
	void browser.tabs.update(tabId, { active: true });
}

/**
 * Get the version of the extension.
 *
 * @returns the extension version
 */
export function getExtensionVersion(): string {
	return browser.runtime.getManifest().version;
}
