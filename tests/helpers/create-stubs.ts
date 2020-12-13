import {
	ApiCallResult,
	ApiCallResultType,
} from '@/background/scrobbler/api-call-result';

export const scrobblerIdStub = 'stub-id';

export function createApiCallResultStub(
	resultType: ApiCallResultType
): ApiCallResult {
	return new ApiCallResult(resultType, scrobblerIdStub);
}
