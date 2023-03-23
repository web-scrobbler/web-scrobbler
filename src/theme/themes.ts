/*
 * Handles everything related to theming
 * Ripped from yayuyokitano/Eggs-Enhancement-Suite
 */

import browser from 'webextension-polyfill';

export async function initializeThemes() {
	const theme = (await browser.storage.sync.get('theme')).theme;
	if (theme) {
		document.body.classList.add(await processTheme(theme));
		return;
	}

	updateTheme('theme-system');
}

export async function updateTheme(theme: ModifiedTheme) {
	document.body.className = '';
	document.body.classList.add(await processTheme(theme));
	await browser.storage.sync.set({
		theme,
	});
}

async function processTheme(theme: string) {
	if (theme === 'theme-system') {
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'theme-dark';
		}
		return 'theme-light';
	}
	return theme;
}

type Theme = 'system' | 'dark' | 'light';
export type ModifiedTheme = `theme-${Theme}`;

export const themeList: Theme[] = ['system', 'dark', 'light'];
export const modifiedThemeList = themeList.map(
	(theme) => `theme-${theme}`
) as ModifiedTheme[];

export async function getTheme(): Promise<ModifiedTheme> {
	return (await browser.storage.sync.get('theme')).theme || 'theme-system';
}
