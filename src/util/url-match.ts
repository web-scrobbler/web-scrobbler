function escapeRegExp(string: string) {
	return string.replace(/[$()*+.?[\\^{|}]/g, '\\$&');
	// return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceAsterisks(string: string) {
	return string.split('*').map(escapeRegExp).join('.*');
}

/**
 * Create regex from single match pattern.
 * @param pattern - URL pattern as string
 * @returns RegExp based on pattern string
 */
export function createPattern(pattern: string): RegExp | null {
	if (typeof pattern !== 'string') {
		return null;
	}

	const urlPartsMatch = /^(\*|https?):\/\/([^/]*)(\/.*)/.exec(pattern);
	if (!urlPartsMatch) {
		return null;
	}
	const scheme = urlPartsMatch[1];
	const host = urlPartsMatch[2];
	const file = urlPartsMatch[3];

	let result = '^';

	if (scheme === '*') {
		result += 'https?';
	} else {
		result += `${scheme}`;
	}
	result += escapeRegExp('://');

	if (host === '*') {
		result += '[^\\/]+';
	} else if (host) {
		let modifiedHost = host;

		if (host.startsWith('*.')) {
			result += '([^\\/]+\\.|)';
			modifiedHost = modifiedHost.substr(2);
		}
		result += replaceAsterisks(modifiedHost);
	} else {
		return null;
	}

	result += replaceAsterisks(file);
	result += '$';

	return new RegExp(result);
}

/**
 * Test if URL matches given URL pattern.
 * @param string - URL
 * @param pattern - URL pattern
 * @returns Result
 */
export function test(string: string, pattern: string): boolean {
	const regex = createPattern(pattern);
	if (!regex) {
		return false;
	}

	return regex.test(string);
}
