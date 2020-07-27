import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import { hideStringInText } from '@/background/util/util';

const functionTestData: FunctionTestData<typeof hideStringInText>[] = [
	{
		description: 'should hide string in text',
		funcParameters: ['SAMPLE', 'This is a SAMPLE string'],
		expectedValue: 'This is a ****** string',
	},
	{
		description: 'should do nothing if string is null',
		funcParameters: [null, 'This is a SAMPLE string'],
		expectedValue: 'This is a SAMPLE string',
	},
	{
		description: 'should do nothing if string is empty',
		funcParameters: ['', 'This is a SAMPLE string'],
		expectedValue: 'This is a SAMPLE string',
	},
	{
		description: 'should not fall on null source string',
		funcParameters: [null, null],
		expectedValue: null,
	},
	{
		description: 'should not fall on empty source string',
		funcParameters: ['', ''],
		expectedValue: '',
	},
];

describeAndTestFunction(hideStringInText, functionTestData);
