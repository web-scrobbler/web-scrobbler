import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import Util from '@/content/util';

const functionTestData: FunctionTestData<
	typeof Util.extractUrlFromCssProperty
>[] = [
	{
		description: 'should extract URL from CSS property (double quotes)',
		funcParameters: ['url("http://example.com/image.png")'],
		expectedValue: 'http://example.com/image.png',
	},
	{
		description: 'should extract URL from CSS property (single quotes)',
		funcParameters: ["url('http://example.com/image.png')"],
		expectedValue: 'http://example.com/image.png',
	},
	{
		description: 'should extract URL from CSS property (no quotes)',
		funcParameters: ['url(http://example.com/image.png)'],
		expectedValue: 'http://example.com/image.png',
	},
	{
		description: 'should extract URL from shorthand CSS property',
		funcParameters: [
			'#ffffff url("http://example.com/image.png") no-repeat right top;',
		],
		expectedValue: 'http://example.com/image.png',
	},
	{
		description: 'should return null for malformed CSS property',
		funcParameters: ['whatever'],
		expectedValue: null,
	},
	{
		description: 'should return null for null',
		funcParameters: [null],
		expectedValue: null,
	},
];

describeAndTestFunction(
	Util.extractUrlFromCssProperty.bind(Util),
	functionTestData
);
