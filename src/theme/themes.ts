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

export async function updateTheme(theme: string) {
	document.body.classList.remove('theme-dark');
	document.body.classList.remove('theme-light');
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

export const themeList = ['system', 'dark', 'light'];

export async function getTheme() {
	return (await browser.storage.sync.get('theme')).theme || 'theme-system';
}
