import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';
import { createScrobblerResultStub } from '#/helpers/create-stubs';

import { ScrobblerResultType } from '@/background/scrobbler/ScrobblerResult';
import { isAnyResult } from '@/background/util/util';

const resultOk = createScrobblerResultStub(ScrobblerResultType.OK);
const resultError = createScrobblerResultStub(ScrobblerResultType.ERROR_OTHER);

const functionTestData: FunctionTestData<typeof isAnyResult>[] = [
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
			[resultError, resultError, resultOk],
			ScrobblerResultType.OK,
		],
		expectedValue: true,
	},
];

describeAndTestFunction(isAnyResult, functionTestData);
