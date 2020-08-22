import { browser } from 'webextension-polyfill-ts';

/**
 * Return a translation string by a given string ID. Return the string ID
 * as a fallback value, if the translation string is missing.
 *
 * The `i18n.getMessage` function returns an empty string if the translation
 * string is not found, but we don't need this behavior.
 *
 * This function also can be used for tagged templates. Examples:
 *  - L`stringId`
 *  - L`stringId ${arg1} ${arg2} ...`
 *
 * @param strings String ID or array of template strings
 * @param substitutions List of substitutions
 *
 * @return Translated string
 */
export function L(
	strings: string | TemplateStringsArray,
	...substitutions: string[]
): string {
	let stringId: string;
	if (typeof strings === 'string') {
		stringId = strings;
	} else {
		stringId = strings.raw[0].trim();
	}

	return browser.i18n.getMessage(stringId, [...substitutions]) || stringId;
}
