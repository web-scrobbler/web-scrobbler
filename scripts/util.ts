/**
 * Folder names corresponding to build targets
 */
enum outputFolder {
	chrome = 'chrome',
	firefox = 'firefox',
	safari = 'safariraw',
}

/**
 * release target enum
 */
export enum releaseTargets {
	chrome = 'chrome',
	firefox = 'firefox',
	safari = 'safari',
}

/**
 * @returns true if dev build, false otherwise.
 */
export function isDev() {
	return releaseType === 'dev';
}

/**
 * Get folder name corresponding to current build target
 *
 * @param browser - build target
 * @returns folder name
 */
export function getBrowser() {
	const browser = releaseTarget;
	if (!browser) throw new Error('No browser specified');
	const browserName = outputFolder[browser as keyof typeof outputFolder];
	if (!browserName) throw new Error(`Invalid browser ${browser} specified`);
	return browserName;
}

export const releaseTarget = process.argv.at(-1);
export const releaseType = process.argv.at(-2);
