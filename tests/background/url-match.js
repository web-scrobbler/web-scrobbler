'use strict';

/**
 * Tests for 'url-match' module.
 */

const expect = require('chai').expect;
const UrlMatch = require('../../src/core/background/util/url-match');

const URL_MATCH_DATA = [{
	description: 'should match exact pattern',
	pattern: 'http://example.com/',
	urls: ['http://example.com/']
}, {
	description: 'should match for all schemes',
	pattern: '*://example.com/',
	urls: ['http://example.com/', 'https://example.com/']
}, {
	description: 'should match for all subdomains',
	pattern: '*://*.example.com/',
	urls: ['http://www.example.com/', 'https://just.example.com/']
}, {
	description: 'should match for all hosts',
	pattern: '*://*/player',
	urls: ['http://example.com/player', 'https://whatever.com/player']
}, {
	description: 'should match for all paths',
	pattern: '*://example.com/*',
	urls: [
		'http://example.com/path1',
		'https://example.com/path2',
		'http://example.com/'
	]
}, {
	description: 'should match for all tlds',
	pattern: '*://example.*/',
	urls: [
		'http://example.com/',
		'http://example.org/',
		'http://example.co.uk/',
	]
}, {
	description: 'should match URL for all schemes, tlds and paths',
	pattern: '*://example.*/*',
	urls: [
		'http://example.com/',
		'https://example.com/path',
		'https://example.co.uk/',
	]
}];

function runTests() {
	for (let data of URL_MATCH_DATA) {
		let { description, pattern, urls } = data;

		describe(`Pattern: ${pattern}`, function() {
			for (let url of urls) {
				it(`${description}: ${url}`, function() {
					expect(UrlMatch.test(url, pattern)).to.be.true;
				});

			}
		});

	}
}

runTests();
