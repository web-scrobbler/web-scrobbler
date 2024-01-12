/**
 * Handles everything related to theming
 * Ripped from https://github.com/yayuyokitano/Eggs-Enhancement-Suite
 */

import browser from 'webextension-polyfill';

// TODO: improve across the board

/**
 * Initializes the theme from storage. To be run on load.
 */
export async function initializeThemes() {
	// eslint-disable-next-line
	const theme = (await browser.storage.sync.get('theme')).theme;
	if (theme) {
		// eslint-disable-next-line
		document.body.classList.add(await processTheme(theme));
		return;
	}

	updateTheme('theme-system');
}

/**
 * Change the theme and update DOM to reflect the change.
 *
 * @param theme - New theme
 */
export async function updateTheme(theme: ModifiedTheme) {
	document.body.className = '';
	document.body.classList.add(processTheme(theme));
	await browser.storage.sync.set({
		theme,
	});
}

/**
 * @returns true if user has dark theme enabled on system/browser level; false otherwise
 */
const prefersDarkTheme = () =>
	window.matchMedia('(prefers-color-scheme: dark)').matches;

/**
 * @returns true if user has high contrast mode enabled on system/browser level; false otherwise
 */
const usesHighContrast = () =>
	window.matchMedia(
		'(forced-colors: active), (prefers-contrast: more), (-ms-high-contrast: active)',
	).matches;

/**
 * Process the current theme, to get the correct display theme for themes that have multiple possibilities
 *
 * @param theme - current theme
 * @returns the corresponding display theme
 */
function processTheme(theme: string) {
	if (theme === 'theme-system') {
		const themeColor = prefersDarkTheme() ? 'dark' : 'light';
		const highContrastString = usesHighContrast() ? 'high-contrast-' : '';
		return `theme-${highContrastString}${themeColor}`;
	}
	return theme;
}

type Theme =
	| 'system'
	| 'dark'
	| 'light'
	| 'high-contrast-dark'
	| 'high-contrast-light';
export type ModifiedTheme = `theme-${Theme}`;

export const themeList: Theme[] = [
	'system',
	'dark',
	'light',
	'high-contrast-dark',
	'high-contrast-light',
];
export const modifiedThemeList = themeList.map(
	(theme) => `theme-${theme}`,
) as ModifiedTheme[];

/**
 * Get the current theme from storage
 *
 * @returns current theme
 */
export async function getTheme(): Promise<ModifiedTheme> {
	// eslint-disable-next-line
	return (await browser.storage.sync.get('theme')).theme || 'theme-system';
}
