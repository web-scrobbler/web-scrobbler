import { browser } from 'webextension-polyfill-ts';

/**
 * Return a translation string by a given string ID. Return the string ID
 * as a fallback value, if the translation string is missing.
 *
 * The `i18n.getMessage` function returns an empty string if the translation
 * string is not found, but we don't need this behavior.
 *
 * @param stringId String ID
 * @param args List of substitutions
 *
 * @return Translated string
 */
export function L(stringId: string, ...args: string[]): string {
	return browser.i18n.getMessage(stringId, [...args]) || stringId;
}
