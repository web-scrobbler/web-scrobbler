import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import Util from '@/content/util';

const functionTestData: FunctionTestData<
	typeof Util.escapeBadTimeValues
>[] = [
	{
		description: 'should round float number',
		funcParameters: [3.25],
		expectedValue: 3,
	},
	{
		description: 'should return null for NaN',
		funcParameters: [NaN],
		expectedValue: null,
	},
	{
		description: 'should return null for Infinity',
		funcParameters: [Infinity],
		expectedValue: null,
	},
	{
		description: 'should return null for -Infinity',
		funcParameters: [-Infinity],
		expectedValue: null,
	},
	{
		description: 'should return integer number as is',
		funcParameters: [3],
		expectedValue: 3,
	},
	{
		description: 'should return null for other input',
		funcParameters: [[]],
		expectedValue: null,
	},
];

describeAndTestFunction(
	Util.escapeBadTimeValues.bind(Util),
	functionTestData
);
