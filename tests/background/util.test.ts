/**
 * Tests for 'util' (background) module.
 */

import { expect, describe, it } from 'vitest';
import * as Util from '@/util/util';
import { TestData } from '#/types/types';

import { ServiceCallResult } from '@/core/object/service-call-result';

const scrobblePercent = 50;

const HIDE_STRING_IN_TEXT_DATA = [
	{
		description: 'should hide string in text',
		args: ['SAMPLE', 'This is a SAMPLE string'],
		expected: 'This is a ****** string',
	},
	{
		description: 'should do nothing if string is null',
		args: [null, 'This is a SAMPLE string'],
		expected: 'This is a SAMPLE string',
	},
	{
		description: 'should do nothing if string is empty',
		args: ['', 'This is a SAMPLE string'],
		expected: 'This is a SAMPLE string',
	},
	{
		description: 'should not fall on null source string',
		args: [null, null],
		expected: null,
	},
	{
		description: 'should not fall on empty source string',
		args: ['', ''],
		expected: '',
	},
];

const HIDE_OBJECT_VALUE_DATA = [
	{
		description: 'should hide string',
		args: ['Sensitive'],
		expected: '*********',
	},
	{
		description: 'should hide array, but display array length',
		args: [[1, 2, 3]],
		expected: '[Array(3)]',
	},
	{
		description: 'should hide object with generic placeholder',
		args: [{ 1: 1, 2: 2 }],
		expected: Util.HIDDEN_PLACEHOLDER,
	},
	{
		description: 'should display null as is',
		args: [undefined],
		expected: 'undefined',
	},
	{
		description: 'should display null as is',
		args: [null],
		expected: 'null',
	},
	{
		description: 'should display empty string as is',
		args: [''],
		expected: '',
	},
];

const GET_SECONDS_TO_SCROBBLE_DATA = [
	{
		description: 'should return min time if duration is zero',
		args: [0, scrobblePercent],
		expected: Util.DEFAULT_SCROBBLE_TIME,
	},
	{
		description: 'should return min time if duration is null',
		args: [null, scrobblePercent],
		expected: Util.DEFAULT_SCROBBLE_TIME,
	},
	{
		description: 'should return min time if duration type is not number',
		args: ['duration', scrobblePercent],
		expected: Util.DEFAULT_SCROBBLE_TIME,
	},
	{
		description: 'should return min time if duration is NaN',
		args: [NaN, scrobblePercent],
		expected: Util.DEFAULT_SCROBBLE_TIME,
	},
	{
		description: 'should return min time if duration is +Infinity',
		args: [Infinity, scrobblePercent],
		expected: Util.DEFAULT_SCROBBLE_TIME,
	},
	{
		description: 'should return min time if duration is -Infinity',
		args: [-Infinity, scrobblePercent],
		expected: Util.DEFAULT_SCROBBLE_TIME,
	},
	{
		description: 'should return -1 for short songs',
		args: [Util.MIN_TRACK_DURATION - 1, scrobblePercent],
		expected: -1,
	},
	{
		description: 'should return half of song duration',
		args: [190, scrobblePercent],
		expected: 95,
	},
	{
		description: 'should return max time for long songs',
		args: [Util.MAX_SCROBBLE_TIME * 2 + 1, scrobblePercent],
		expected: Util.MAX_SCROBBLE_TIME,
	},
];

const IS_ANY_RESULT_DATA = [
	{
		description: 'should return false for empty result list',
		args: [[], ServiceCallResult.RESULT_OK],
		expected: false,
	},
	{
		description: 'should return false for non-matching result',
		args: [
			[
				ServiceCallResult.ERROR_OTHER,
				ServiceCallResult.ERROR_OTHER,
				ServiceCallResult.ERROR_OTHER,
			],
			ServiceCallResult.RESULT_OK,
		],
		expected: false,
	},
	{
		description: 'should return true for matching result',
		args: [
			[
				ServiceCallResult.ERROR_OTHER,
				ServiceCallResult.RESULT_OK,
				ServiceCallResult.ERROR_OTHER,
			],
			ServiceCallResult.RESULT_OK,
		],
		expected: true,
	},
];

const ARE_ALL_RESULTS_DATA = [
	{
		description: 'should return false for empty result list',
		args: [[], ServiceCallResult.RESULT_OK],
		expected: false,
	},
	{
		description: 'should return false for non-matching result',
		args: [
			[
				ServiceCallResult.ERROR_OTHER,
				ServiceCallResult.ERROR_OTHER,
				ServiceCallResult.ERROR_OTHER,
			],
			ServiceCallResult.RESULT_OK,
		],
		expected: false,
	},
	{
		description: 'should return true for matching result',
		args: [
			[
				ServiceCallResult.ERROR_OTHER,
				ServiceCallResult.ERROR_OTHER,
				ServiceCallResult.ERROR_OTHER,
			],
			ServiceCallResult.ERROR_OTHER,
		],
		expected: true,
	},
];

const testData = [
	{
		func: Util.isAnyResult,
		data: IS_ANY_RESULT_DATA,
	},
	{
		func: Util.areAllResults,
		data: ARE_ALL_RESULTS_DATA,
	},
	{
		func: Util.hideObjectValue,
		data: HIDE_OBJECT_VALUE_DATA,
	},
	{
		func: Util.hideStringInText,
		data: HIDE_STRING_IN_TEXT_DATA,
	},
	{
		func: Util.getSecondsToScrobble,
		data: GET_SECONDS_TO_SCROBBLE_DATA,
	},
];

/**
 * Run all tests.
 */
function runTests() {
	for (const entry of testData) {
		const { func, data } = entry;
		const description = func.name;

		describe(description, () => {
			testFunction(func, data);
		});
	}

	describe('debugLog', testDebugLog);
	describe('timeoutPromise', testTimeoutPromise);
}

function testDebugLog() {
	it('should throw an error if type is invalid', () => {
		function callInvalidDebugLog() {
			Util.debugLog('Test', 'invalid_type123' as any);
		}

		expect(callInvalidDebugLog).to.throw();
	});
}

function testTimeoutPromise() {
	const testTimeout = 100;

	it('should throw an error if promise is not resolved earlier', async () => {
		const slowPromise = new Promise((resolve) => {
			setTimeout(resolve, testTimeout * 2);
		});
		try {
			await Util.timeoutPromise(testTimeout, slowPromise);
		} catch (err) {
			/* Do nothing, it's expected */
			return;
		}

		throw new Error('The promise should be failed');
	});

	it('should not throw an error if promise is resolved earlier', async () => {
		await Util.timeoutPromise(testTimeout, Promise.resolve());
	});

	it('should not throw an error if promise is rejected earlier', async () => {
		const testErr = new Error('Test');
		try {
			await Util.timeoutPromise(testTimeout, Promise.reject(testErr));
		} catch (err) {
			if (err !== testErr) {
				throw err;
			}
		}
	});
}

/**
 * Test function.
 * @param func - Function to be tested
 * @param testData - Array of test data
 */
function testFunction(func: (...args: any[]) => unknown, testData: TestData[]) {
	const boundFunc = func.bind(Util);

	for (const data of testData) {
		const { description, args, expected } = data;
		if (args === undefined) {
			throw new Error(`${description}: function arguments are missing`);
		}

		const actual = boundFunc(...args);
		it(description, () => {
			expect(actual).to.be.equal(expected);
		});
	}
}

runTests();
