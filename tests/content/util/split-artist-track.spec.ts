import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import Util from '@/content/util';

const functionTestData: FunctionTestData<typeof Util.splitArtistTrack>[] = [
	{
		description: 'should return empty result for empty input',
		funcParameters: ['', null],
		expectedValue: { artist: null, track: null },
	},
	{
		description: 'should return empty result for null input',
		funcParameters: [null, null],
		expectedValue: { artist: null, track: null },
	},
	{
		description: 'should split artist and track w/o swap and separators',
		funcParameters: ['Artist - Track'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should split artist and track',
		funcParameters: ['Artist - Track', null],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should split artist and track by custom separator',
		funcParameters: ['Artist * Track', [' * ']],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should not split malformed string',
		funcParameters: ['Artist & Track', null],
		expectedValue: { artist: null, track: null },
	},
	{
		description: 'should split artist and track, and swap them',
		// @ts-ignore
		funcParameters: ['Track - Artist', null, { swap: true }],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
];

describeAndTestFunction(Util.splitArtistTrack.bind(Util), functionTestData);
