import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import Util from '@/content/util';

const functionTestData: FunctionTestData<typeof Util.splitTimeInfo>[] = [
	{
		description: 'should split time info',
		funcParameters: ['01:00 / 03:00'],
		expectedValue: { currentTime: 60, duration: 180 },
	},
	{
		description: 'should split time info',
		funcParameters: ['01:00 / 03:00', '/'],
		expectedValue: { currentTime: 60, duration: 180 },
	},
	{
		description: 'should split time info and swap values',
		// @ts-ignore
		funcParameters: ['03:00 / 01:00', '/', { swap: true }],
		expectedValue: { currentTime: 60, duration: 180 },
	},
	{
		description: 'should not split malformed time info text',
		funcParameters: ['01:10:30', '/'],
		expectedValue: { currentTime: null, duration: null },
	},
];

describeAndTestFunction(Util.splitTimeInfo.bind(Util), functionTestData);
