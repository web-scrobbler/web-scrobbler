import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import { getScrobblerLabel } from '@/background/scrobbler/ScrobblerLabel';

export interface AccountInfo {
	readonly username: string;
	readonly profileUrl: string;

	readonly scrobblerId: ScrobblerId;
	readonly scrobblerLabel: string;
	// readonly canSignInViaWeb: boolean;
	// readonly canUseUserProperties: boolean;
}

export function createEmptyAccountInfo(scrobblerId: ScrobblerId): AccountInfo {
	return {
		username: null,
		profileUrl: null,
		scrobblerId: scrobblerId,
		scrobblerLabel: getScrobblerLabel(scrobblerId),
	};
}
