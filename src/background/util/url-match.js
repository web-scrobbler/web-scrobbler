/**
 * Create a regex object from a single match pattern.
 *
 * @param {String} pattern URL pattern as string
 *
 * @return {Object} RegExp based on pattern string
 */
export function createPattern(pattern) {
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
 * Test if a URL matches a given URL pattern.
 *
 * @param {String} string URL
 * @param {String} pattern URL pattern
 *
 * @return {Boolean} Result
 */
export function test(string, pattern) {
	const regex = createPattern(pattern);
	if (!regex) {
		return false;
	}

	return regex.test(string);
}

function escapeRegExp(string) {
	return string.replace(/[$()*+.?[\\^{|}]/g, '\\$&');
	// return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceAsterisks(string) {
	return string.split('*').map(escapeRegExp).join('.*');
}
