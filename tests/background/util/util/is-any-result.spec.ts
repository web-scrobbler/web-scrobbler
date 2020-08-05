import { isAnyResult } from '@/background/util/util';

import { ApiCallResult } from '@/background/scrobbler/api-call-result';

import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';
import { createApiCallResultStub } from '#/helpers/create-stubs';

const { RESULT_OK, ERROR_OTHER } = ApiCallResult;

const resultOk = createApiCallResultStub(RESULT_OK);
const resultError = createApiCallResultStub(ERROR_OTHER);

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
