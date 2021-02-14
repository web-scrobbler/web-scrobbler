import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';
import { createScrobblerResultStub } from '#/helpers/create-stubs';

import { ScrobblerResultType } from '@/background/scrobbler/ScrobblerResult';
import { areAllResults } from '@/background/util/util';

const resultError = createScrobblerResultStub(ScrobblerResultType.ERROR_OTHER);

const functionTestData: FunctionTestData<typeof areAllResults>[] = [
	{
		description: 'should return false for empty result list',
		funcParameters: [[], ScrobblerResultType.OK],
		expectedValue: false,
	},
	{
		description: 'should return false for non-matching result',
		funcParameters: [
			[resultError, resultError, resultError],
			ScrobblerResultType.OK,
		],
		expectedValue: false,
	},
	{
		description: 'should return true for matching result',
		funcParameters: [
			[resultError, resultError, resultError],
			ScrobblerResultType.ERROR_OTHER,
		],
		expectedValue: true,
	},
];

describeAndTestFunction(areAllResults, functionTestData);
