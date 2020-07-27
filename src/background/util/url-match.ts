/**
 * Create a regular expression from a URL match pattern.
 *
 * @param pattern URL pattern as string
 *
 * @return RegExp based on pattern string
 */
export function createPattern(pattern: string): RegExp {
	const urlPartsMatch = /^(\*|https?):\/\/([^/]*)(\/.*)/.exec(pattern);
	if (!urlPartsMatch) {
		return null;
	}

	const [, scheme, host, file] = urlPartsMatch;

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
 * Test if a URL matches a given URL pattern.
 *
 * @param string URL
 * @param pattern URL pattern
 *
 * @return Result
 */
export function isPatternMatched(string: string, pattern: string): boolean {
	const regex = createPattern(pattern);
	if (!regex) {
		return false;
	}

	return regex.test(string);
}

function escapeRegExp(string: string): string {
	return string.replace(/[$()*+.?[\\^{|}]/g, '\\$&');
}

function replaceAsterisks(string: string): string {
	return string.split('*').map(escapeRegExp).join('.*');
}
