import {
	ScrobblerResult,
	ApiCallResultType,
} from '@/background/scrobbler/ScrobblerResult';

export const scrobblerIdStub = 'stub-id';

export function createScrobblerResultStub(
	resultType: ApiCallResultType
): ScrobblerResult {
	return new ScrobblerResult(resultType, scrobblerIdStub);
}
