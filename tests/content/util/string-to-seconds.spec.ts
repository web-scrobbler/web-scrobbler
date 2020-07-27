import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import Util from '@/content/util';

const functionTestData: FunctionTestData<typeof Util.stringToSeconds>[] = [
	{
		description:
			'should parse time that contains leading and trailing whitespace',
		funcParameters: [' 01:10:30 '],
		expectedValue: 4230,
	},
	{
		description: 'should parse time in hh:mm:ss format',
		funcParameters: ['01:10:30'],
		expectedValue: 4230,
	},
	{
		description: 'should parse time in h:mm:ss format',
		funcParameters: ['5:20:00'],
		expectedValue: 19200,
	},
	{
		description: 'should parse negative time',
		funcParameters: ['-01:10'],
		expectedValue: -70,
	},
	{
		description:
			'should parse negative time that contains leading and trailing whitespace',
		funcParameters: [' -01:10 '],
		expectedValue: -70,
	},
	{
		description: 'should parse time in mm:ss format',
		funcParameters: ['05:20'],
		expectedValue: 320,
	},
	{
		description: 'should parse time in m:ss format',
		funcParameters: ['5:20'],
		expectedValue: 320,
	},
	{
		description: 'should parse time in ss format',
		funcParameters: ['20'],
		expectedValue: 20,
	},
	{
		description: 'should parse time in s format',
		funcParameters: ['2'],
		expectedValue: 2,
	},
	{
		description: 'should not parse empty string',
		funcParameters: [''],
		expectedValue: 0,
	},
	{
		description: 'should not parse null value',
		funcParameters: [null],
		expectedValue: 0,
	},
	{
		description: 'should not parse a format without colons',
		funcParameters: ['01 10 30'],
		expectedValue: 0,
	},
	{
		description: 'should not parse a format with days',
		funcParameters: ['01:00:00:00'],
		expectedValue: 0,
	},
	{
		description: 'should not parse mm:s format',
		funcParameters: ['12:4'],
		expectedValue: 0,
	},
	{
		description: 'should not parse hh:m:s format',
		funcParameters: ['12:3:4'],
		expectedValue: 0,
	},
];

describeAndTestFunction(Util.stringToSeconds.bind(Util), functionTestData);
