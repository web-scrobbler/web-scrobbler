'use strict';

function escapeRegExp(string) {
	return string.replace(/[[^$.|?*+(){}\\]/g, '\\$&');
	// return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceAsterisks(string) {
	return string.split('*').map(escapeRegExp).join('.*');
}

/**
 * Create regex from single match pattern.
 * @param  {String} pattern URL pattern as string
 * @return {Object} RegExp based on pattern string
 */
function createPattern(pattern) {
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
	} else if (host[0] === '*') {
		result += `([^\\/]+\\.|)${escapeRegExp(host.substr(2))}`;
	} else if (host) {
		result += replaceAsterisks(host);
	} else {
		return null;
	}

	result += replaceAsterisks(file);
	result += '$';

	return new RegExp(result);
}

/**
 * Test if URL matches given URL pattern.
 * @param  {String} string URL
 * @param  {String} pattern URL pattern
 * @return {Boolean} Result
 */
function test(string, pattern) {
	let regex = createPattern(pattern);
	if (!regex) {
		return false;
	}

	return regex.test(string);
}

define(() => {
	return { test };
});

// @ifdef DEBUG
/**
 * Export function if script is executed in Node.js context.
 */
if (typeof module !== 'undefined') {
	module.exports = { test };
}
// @endif
