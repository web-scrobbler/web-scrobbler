import { Scrobbler } from '@/background/scrobbler/Scrobbler';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

import { MalojaScrobbleService } from '@/background/scrobbler/service/maloja/MalojaScrobbleService';

import type { ScrobblerSession } from '@/background/account/ScrobblerSession';
import type { ScrobbleService } from '@/background/scrobbler/service/ScrobbleService';

export class MalojaScrobbler extends Scrobbler {
	constructor(session: ScrobblerSession, private apiUrl: string) {
		super(session);
	}

	getId(): ScrobblerId {
		return ScrobblerId.Maloja;
	}

	getLabel(): string {
		return 'Maloja';
	}

	getProfileUrl(): string {
		return null;
	}

	getStatusUrl(): string {
		return null;
	}

	createScrobbleService(): ScrobbleService {
		return new MalojaScrobbleService(this.session, this.apiUrl);
	}
}
