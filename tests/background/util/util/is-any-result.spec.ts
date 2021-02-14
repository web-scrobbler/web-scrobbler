import { isAnyResult } from '@/background/util/util';

import { ScrobblerResult } from '@/background/scrobbler/ScrobblerResult';

import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';
import { createScrobblerResultStub } from '#/helpers/create-stubs';

const { RESULT_OK, ERROR_OTHER } = ScrobblerResult;

const resultOk = createScrobblerResultStub(RESULT_OK);
const resultError = createScrobblerResultStub(ERROR_OTHER);

const functionTestData: FunctionTestData<typeof isAnyResult>[] = [
	{
		description: 'should return false for empty result list',
		funcParameters: [[], RESULT_OK],
		expectedValue: false,
	},
	{
		description: 'should return false for non-matching result',
		funcParameters: [[resultError, resultError, resultError], RESULT_OK],
		expectedValue: false,
	},
	{
		description: 'should return true for matching result',
		funcParameters: [[resultError, resultError, resultOk], RESULT_OK],
		expectedValue: true,
	},
];

describeAndTestFunction(isAnyResult, functionTestData);
