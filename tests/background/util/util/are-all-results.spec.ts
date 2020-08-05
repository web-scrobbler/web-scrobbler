import { areAllResults } from '@/background/util/util';

import { ApiCallResult } from '@/background/scrobbler/api-call-result';
import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

const { RESULT_OK, ERROR_OTHER } = ApiCallResult;

const resultError = new ApiCallResult(ERROR_OTHER, 'stub-id');

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
