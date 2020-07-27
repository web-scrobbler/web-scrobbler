import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import { hideObjectValue } from '@/background/util/util';

const functionTestData: FunctionTestData<typeof hideObjectValue>[] = [
	{
		description: 'should hide string',
		funcParameters: ['Sensitive'],
		expectedValue: '*********',
	},
	{
		description: 'should hide array, but display array length',
		funcParameters: [[1, 2, 3]],
		expectedValue: '[Array(3)]',
	},
	{
		description: 'should hide object, but display number of object keys',
		funcParameters: [{ 1: 1, 2: 2 }],
		expectedValue: '[Object(2)]',
	},
	{
		description: 'should display null as is',
		funcParameters: [undefined],
		expectedValue: 'undefined',
	},
	{
		description: 'should display null as is',
		funcParameters: [null],
		expectedValue: 'null',
	},
	{
		description: 'should display empty string as is',
		funcParameters: [''],
		expectedValue: '',
	},
];

describeAndTestFunction(hideObjectValue, functionTestData);
