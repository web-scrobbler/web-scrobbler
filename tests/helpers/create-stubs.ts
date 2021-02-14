import {
	ScrobblerResult,
	ScrobblerResultType,
} from '@/background/scrobbler/ScrobblerResult';

export const scrobblerIdStub = 'stub-id';

export function createScrobblerResultStub(
	resultType: ScrobblerResultType
): ScrobblerResult {
	return new ScrobblerResult(resultType, scrobblerIdStub);
}
