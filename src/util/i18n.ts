import browser from 'webextension-polyfill';
import { getExtensionVersion } from '@/util/util-browser';

/**
 * Gets localized string from locale.
 * NOTE: THIS FUNCTION RETURNS SAFE OUTPUTS. IT CAN ONLY RETURN CONTENT FROM THE _locales FOLDER.
 * THE RETURN VALUE OF THIS FUNCTION IS USED IN INNERHTML. IT IS SAFE.
 *
 * @param messageName - i18n property name
 * @param substitutions - substitions to be made to i18n content
 * @returns localized string
 */
export function t(messageName: string, substitutions?: string | string[]) {
	return browser.i18n.getMessage(messageName, substitutions);
}

export function currentChangelog() {
	const version = getExtensionVersion();
	return `https://github.com/web-scrobbler/web-scrobbler/releases/tag/v${version}`;
}
