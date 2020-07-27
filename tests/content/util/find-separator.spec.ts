import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import Util from '@/content/util';

const functionTestData: FunctionTestData<typeof Util.findSeparator>[] = [
	{
		description: 'should return null for null input',
		funcParameters: [null],
		expectedValue: null,
	},
	{
		description: 'should return null for empty input',
		funcParameters: [''],
		expectedValue: null,
	},
	{
		description: 'should find separator',
		funcParameters: ['Key : Var'],
		expectedValue: { index: 4, length: 1 },
	},
	{
		description: 'should find custom separator',
		funcParameters: ['Key * Var', [' * ']],
		expectedValue: { index: 3, length: 3 },
	},
	{
		description: 'should not find separator if no separator in string',
		funcParameters: ['Key 2 Var'],
		expectedValue: null,
	},
];

describeAndTestFunction(Util.findSeparator.bind(Util), functionTestData);
