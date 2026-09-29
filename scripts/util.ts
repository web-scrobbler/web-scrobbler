import { resolve } from 'path';
import { execFileSync } from 'child_process';
import { normalizePath } from 'vite';

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
 * @returns true if prod build, false otherwise.
 */
export function isProd() {
	return releaseType === 'dist';
}

/**
 * Get folder name corresponding to current build target
 *
 * @param browser - build target
 * @returns folder name
 */
export function getBrowser() {
	const browser = releaseTarget;
	if (!browser) {
		throw new Error('No browser specified');
	}
	const browserName = outputFolder[browser as keyof typeof outputFolder];
	if (!browserName) {
		throw new Error(`Invalid browser ${browser} specified`);
	}
	return browserName;
}

/**
 * Resolve vite path in a cross-platform way
 *
 * @param paths - paths to resolve
 */
export function resolvePath(...paths: string[]) {
	return normalizePath(resolve(...paths));
}

export function isGitRepository() {
	try {
		return (
			execFileSync('git', ['rev-parse', '--is-inside-work-tree'], {
				encoding: 'utf8',
				stdio: ['ignore', 'pipe', 'ignore'],
			})
				.trim()
				.toLowerCase() === 'true'
		);
	} catch {
		return false;
	}
}

export function gitVersion(): string | null {
	try {
		return execFileSync('git', ['describe', '--always', '--dirty'], {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		}).trim();
	} catch {
		return null;
	}
}

export const releaseTarget = process.argv.at(-1);
export const releaseType = process.argv.at(-2);
