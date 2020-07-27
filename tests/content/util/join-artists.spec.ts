import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import Util from '@/content/util';

const functionTestData: FunctionTestData<typeof Util.joinArtists>[] = [
	{
		description: 'should return null for null',
		funcParameters: [null],
		expectedValue: null,
	},
	{
		description: 'should return null for empty array',
		// @ts-ignore
		funcParameters: [[]],
		expectedValue: null,
	},
	{
		description: 'should return list of artist for valid input',
		// @ts-ignore
		funcParameters: [[{ textContent: 'Artist 1' }]],
		expectedValue: 'Artist 1',
	},
	{
		description: 'should return list of artist for valid input',
		funcParameters: [
			// @ts-ignore
			[{ textContent: 'Artist 1' }, { textContent: 'Artist 2' }],
		],
		expectedValue: 'Artist 1, Artist 2',
	},
];

describeAndTestFunction(Util.joinArtists.bind(Util), functionTestData);
