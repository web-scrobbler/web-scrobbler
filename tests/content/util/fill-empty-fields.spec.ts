import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import Util from '@/content/util';

const functionTestData: FunctionTestData<typeof Util.fillEmptyFields>[] = [
	{
		description: 'should return target if source element is null',
		funcParameters: [{ artist: 'Artist', track: 'Track' }, null, []],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should return target if fields arg is null',
		funcParameters: [
			{ artist: 'Artist', track: 'Track' },
			{ artist: 'New Artist' },
			null,
		],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should not modify target if fields arg is empty',
		funcParameters: [
			{ artist: 'Artist', track: 'Track' },
			{ artist: 'New Artist' },
			[],
		],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should not modify target if source field is missing',
		funcParameters: [{ track: 'Track' }, {}, ['artist']],
		expectedValue: { track: 'Track' },
	},
	{
		description: 'should not modify target if field exists',
		funcParameters: [
			{ artist: 'Artist', track: 'Track' },
			{ artist: 'New Artist' },
			['artist'],
		],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should modify target if field is missing',
		funcParameters: [
			{ track: 'Track' },
			{ artist: 'New Artist' },
			['artist'],
		],
		expectedValue: { artist: 'New Artist', track: 'Track' },
	},
];

describeAndTestFunction(Util.fillEmptyFields.bind(Util), functionTestData);
