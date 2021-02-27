import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import {
	ScrobblerResult,
	ScrobblerResultType,
} from '@/background/scrobbler/ScrobblerResult';

export const scrobblerIdStub = ScrobblerId.LastFm;

export function createScrobblerResultStub(
	resultType: ScrobblerResultType
): ScrobblerResult {
	return new ScrobblerResult(resultType, scrobblerIdStub);
}
