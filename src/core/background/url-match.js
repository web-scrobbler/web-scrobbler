'use strict';

/**
 * Module to test if URL patterns match strings.
 * @author lacivert
 */

/**
 * Create regex from single match pattern.
 * @param  {String} input URL pattern as string
 * @return {Object} RegExp based on pattern string
 */
function createPattern(input) {
	if (typeof input !== 'string') {
		return null;
	}

	function regEscape(s) {
		return s.replace(/[[^$.|?*+(){}\\]/g, '\\$&');
	}

	let match_pattern = '^';
	let result = /^(\*|https?|file|ftp|chrome-extension):\/\//.exec(input);

	// Parse scheme
	if (!result) {
		return null;
	}
	input = input.substr(result[0].length);
	match_pattern += result[1] === '*' ? 'https?://' : `${result[1]}://`;

	// Parse host if scheme is not `file`
	if (result[1] !== 'file') {
		if (!(result = /^(?:\*|(\*\.)?([^/*]+))/.exec(input))) {
			return null;
		}
		input = input.substr(result[0].length);
		// Host is '*'
		if (result[0] === '*') {
			match_pattern += '[^/]+';
		} else {
			// Subdomain wildcard exists
			if (result[1]) {
				match_pattern += '(?:[^/]+\\.)?';
			}
			// Append host (escape special regex characters)
			match_pattern += regEscape(result[2]);// + '/';
		}
	}
	// Add remainder (path)
	match_pattern += input.split('*').map(regEscape).join('.*');
	match_pattern += '$';

	return new RegExp(match_pattern);
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
