import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import Util from '@/content/util';

const functionTestData: FunctionTestData<typeof Util.isArtistTrackEmpty>[] = [
	{
		description: 'should return true for null result',
		funcParameters: [null],
		expectedValue: true,
	},
	{
		description: 'should return true for empty Artist-Track pair',
		funcParameters: [{ artist: null, track: null }],
		expectedValue: true,
	},
	{
		description: 'should return false if field is missing',
		funcParameters: [{ artist: 'Artist', track: null }],
		expectedValue: true,
	},
	{
		description: 'should return false for non-empty Artist-Track pair',
		funcParameters: [{ artist: 'Artist', track: 'Track' }],
		expectedValue: false,
	},
];

describeAndTestFunction(Util.isArtistTrackEmpty.bind(Util), functionTestData);
