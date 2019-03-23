'use strict';

/**
 * Tests for 'util' (background) module.
 */

const expect = require('chai').expect;
const Util = require('../../src/core/background/util');

const HIDE_STRING_IN_TEXT_DATA = [{
	description: 'should hide string in text',
	source: 'This is a SAMPLE string',
	string: 'SAMPLE',
	expected: 'This is a xxxxxE string'
}, {
	description: 'should do nothing if string is null',
	source: 'This is a SAMPLE string',
	string: null,
	expected: 'This is a SAMPLE string'
}, {
	description: 'should do nothing if string is empty',
	source: 'This is a SAMPLE string',
	string: '',
	expected: 'This is a SAMPLE string'
}, {
	description: 'should not fall on null source string',
	source: null,
	string: null,
	expected: null
}, {
	description: 'should not fall on empty source string',
	source: '',
	string: '',
	expected: ''
}];

const HIDE_STRING_DATA = [{
	description: 'should hide string',
	source: 'Sensitive Data',
	expected: 'xxxxxtive Data'
}, {
	description: 'should not fall on null value',
	source: null,
	expected: null
}, {
	description: 'should not fall on empty value',
	source: '',
	expected: ''
}];

/**
 * Run all tests.
 */
function runTests() {
	describe('hideString', testHideString);
	describe('hideStringInText', testHideStringInText);
}

/**
 * Test 'Util.hideStringInText' function.
 */
function testHideStringInText() {
	for (let data of HIDE_STRING_IN_TEXT_DATA) {
		let { description, source, expected, string } = data;
		let actual = Util.hideStringInText(string, source);

		it(description, () => {
			expect(actual).to.be.equal(expected);
		});
	}
}

/**
 * Test 'Util.hideString' function.
 */
function testHideString() {
	for (let data of HIDE_STRING_DATA) {
		let { description, source, expected } = data;
		let actual = Util.hideString(source);

		it(description, () => {
			expect(actual).to.be.equal(expected);
		});
	}
}

module.exports = runTests;
