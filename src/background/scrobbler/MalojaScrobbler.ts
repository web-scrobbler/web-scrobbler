import { Scrobbler } from '@/background/scrobbler/Scrobbler';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

import { MalojaScrobbleService } from '@/background/scrobbler/service/maloja/MalojaScrobbleService';

import type { ScrobbleService } from '@/background/scrobbler/service/ScrobbleService';
import type { Session } from '@/background/account/Session';

export class MalojaScrobbler extends Scrobbler {
	constructor(protected session: Session, private apiUrl: string) {
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
