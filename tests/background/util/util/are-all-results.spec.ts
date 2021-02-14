import { createScrobblerResultStub } from '#/helpers/create-stubs';

import { areAllResults } from '@/background/util/util';

import { ScrobblerResult } from '@/background/scrobbler/ScrobblerResult';
import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

const { RESULT_OK, ERROR_OTHER } = ScrobblerResult;

const resultError = createScrobblerResultStub(ERROR_OTHER);

const functionTestData: FunctionTestData<typeof areAllResults>[] = [
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
		funcParameters: [[resultError, resultError, resultError], ERROR_OTHER],
		expectedValue: true,
	},
];

describeAndTestFunction(areAllResults, functionTestData);
