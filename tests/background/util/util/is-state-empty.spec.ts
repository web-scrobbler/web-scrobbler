import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import { isStateEmpty } from '@/background/util/util';

const functionTestData: FunctionTestData<typeof isStateEmpty>[] = [
	{
		description:
			'should detect empty state if no artist and track are specified',
		funcParameters: [
			{
				artist: null,
				track: null,
			},
		],
		expectedValue: true,
	},
	{
		description: 'should detect empty state if no track is specified',
		funcParameters: [
			{
				artist: 'Artist',
				track: null,
			},
		],
		expectedValue: true,
	},
	{
		description: 'should detect empty state if no artist is specified',
		funcParameters: [
			{
				artist: null,
				track: 'Artist',
			},
		],
		expectedValue: true,
	},
	{
		description:
			'should detect non-empty state if unique ID is non-nullable',
		funcParameters: [
			{
				artist: null,
				track: null,
				uniqueID: 'unique',
			},
		],
		expectedValue: false,
	},
	{
		description:
			'should detect non-empty state if duration is non-nullable',
		funcParameters: [
			{
				artist: null,
				track: null,
				duration: 123,
			},
		],
		expectedValue: false,
	},
	{
		description:
			'should detect non-empty state if all required properties are present',
		funcParameters: [
			{
				artist: 'Artist',
				track: 'Track',
				duration: 123,
				uniqueID: 'unique',
			},
		],
		expectedValue: false,
	},
];

describeAndTestFunction(isStateEmpty, functionTestData);
