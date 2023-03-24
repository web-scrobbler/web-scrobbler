/**
 * Tests for 'url-match' module.
 */

import { expect, describe, it } from 'vitest';
import * as UrlMatch from '@/util/url-match';

const URL_MATCH_DATA = [
	{
		description: 'should return false for invalid result',
		pattern: 1,
		urls: ['http://example.com/'],
		expected: false,
	},
	{
		description: 'should return false for malformed pattern',
		pattern: 'aaa://test.com/',
		urls: ['http://example.com/'],
		expected: false,
	},
	{
		description: 'should return false for malformed pattern',
		pattern: '*://',
		urls: ['http://example.com/'],
		expected: false,
	},
	{
		description: 'should return false for non-matched pattern',
		pattern: '*://test.com/*',
		urls: ['http://example.com/', 'http://www.test.com/page'],
		expected: false,
	},
	{
		description: 'should return false for input with invalid scheme',
		pattern: '*://test.com/*',
		urls: ['wtf://example.com/'],
		expected: false,
	},
	{
		description: 'should return false for input with no host',
		pattern: '*:///*',
		urls: ['http://example.com/'],
		expected: false,
	},
	{
		description: 'should match exact pattern',
		pattern: 'http://example.com/',
		urls: ['http://example.com/'],
		expected: true,
	},
	{
		description: 'should match for all schemes',
		pattern: '*://example.com/',
		urls: ['http://example.com/', 'https://example.com/'],
		expected: true,
	},
	{
		description: 'should match for domain and all subdomains',
		pattern: '*://*.example.com/',
		urls: ['http://example.com/', 'https://www.example.com/'],
		expected: true,
	},
	{
		description: 'should match for all hosts',
		pattern: '*://*/player',
		urls: ['http://example.com/player', 'https://whatever.com/player'],
		expected: true,
	},
	{
		description: 'should match for all paths',
		pattern: '*://example.com/*',
		urls: [
			'http://example.com/path1',
			'https://example.com/path2',
			'http://example.com/',
		],
		expected: true,
	},
	{
		description: 'should match for all tlds',
		pattern: '*://example.*/',
		urls: [
			'http://example.com/',
			'http://example.org/',
			'http://example.co.uk/',
		],
		expected: true,
	},
	{
		description: 'should match URL for all schemes, tlds and paths',
		pattern: '*://example.*/*',
		urls: [
			'http://example.com/',
			'https://example.com/path',
			'https://example.co.uk/',
		],
		expected: true,
	},
];

function runTests() {
	for (const data of URL_MATCH_DATA) {
		const { description, pattern, urls, expected } = data;

		describe(`Pattern: ${pattern}`, () => {
			for (const url of urls) {
				it(`${description}: ${url}`, () => {
					const actual = UrlMatch.test(url, pattern as string);
					expect(expected).to.be.equal(actual);
				});
			}
		});
	}
}

runTests();
