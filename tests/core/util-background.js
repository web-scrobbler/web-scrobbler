'use strict';

/**
 * Tests for 'util' (background) module.
 */

const expect = require('chai').expect;
const Util = require('../../core/background/util');

const HIDE_STRING_IN_TEXT_DATA = [{
	description: 'should hide string in text',
	source: 'This is a SAMPLE string',
	string: 'SAMPLE',
	expected: 'This is a xxxxxE string'
}, {
	description: 'should do nothing if string is empty',
	source: 'This is a SAMPLE string',
	string: '',
	expected: 'This is a SAMPLE string'
}];

/**
 * Run all tests.
 */
function runTests() {
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

module.exports = runTests;
