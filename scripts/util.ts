/**
 * Folder names corresponding to build targets
 */
export const browserNames = {
	chrome: 'chrome',
	firefox: 'firefox',
	safari: 'safariraw',
};

/**
 * Get folder name corresponding to current build target
 *
 * @param browser - build target
 * @returns folder name
 */
export function getBrowser(browser?: string) {
	if (!browser) throw new Error('No browser specified');
	const browserName = browserNames[browser as keyof typeof browserNames];
	if (!browserName) throw new Error(`Invalid browser ${browser} specified`);
	return browserName;
}
