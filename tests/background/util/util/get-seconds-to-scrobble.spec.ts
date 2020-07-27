import { expect } from 'chai';

import { FunctionTestData, testFunction } from '#/helpers/test-function';

import {
	getSecondsToScrobble,
	DEFAULT_SCROBBLE_TIME,
	MAX_SCROBBLE_TIME,
	MIN_TRACK_DURATION,
} from '@/background/util/util';

const scrobblePercent = 50;

const invalidNumberValues = [+Infinity, -Infinity];

const functionTestData: FunctionTestData<typeof getSecondsToScrobble>[] = [
	{
		description: 'should return default scrobble time if duration is zero',
		funcParameters: [0, scrobblePercent],
		expectedValue: DEFAULT_SCROBBLE_TIME,
	},
	{
		description: 'should return default scrobble time if duration is null',
		funcParameters: [null, scrobblePercent],
		expectedValue: DEFAULT_SCROBBLE_TIME,
	},
	{
		description: 'should return default scrobble time if duration is NaN',
		funcParameters: [NaN, scrobblePercent],
		expectedValue: DEFAULT_SCROBBLE_TIME,
	},
	{
		description: 'should return -1 for short songs',
		funcParameters: [MIN_TRACK_DURATION - 1, scrobblePercent],
		expectedValue: -1,
	},
	{
		description: 'should return half a song duration',
		funcParameters: [190, scrobblePercent],
		expectedValue: 95,
	},
	{
		description: 'should return max time for long songs',
		funcParameters: [
			MAX_SCROBBLE_TIME * scrobblePercent + 1,
			scrobblePercent,
		],
		expectedValue: MAX_SCROBBLE_TIME,
	},
];

describe('getSecondsToScrobble', () => {
	testFunction(getSecondsToScrobble, functionTestData);

	it('should throw an error if invalid duration is passed', () => {
		invalidNumberValues.forEach((value) => {
			expect(() =>
				getSecondsToScrobble(value, scrobblePercent)
			).to.throw();
		});
	});

	it('should throw an error if invalid percent is passed', () => {
		invalidNumberValues.forEach((value) => {
			expect(() => getSecondsToScrobble(190, value)).to.throw();
		});
	});

	it('should throw an error if percent value is greater than 100', () => {
		expect(() => getSecondsToScrobble(190, 101)).to.throw();
	});

	it('should throw an error if percent value is less than 1', () => {
		expect(() => getSecondsToScrobble(190, 0)).to.throw();
		expect(() => getSecondsToScrobble(190, -1)).to.throw();
	});
});
