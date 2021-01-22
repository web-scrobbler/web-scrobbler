import { ListenBrainzScrobblerService } from '@/background/scrobbler/service/listenbrainz/ListenBrainzScrobblerService';

import { Scrobbler } from '@/background/scrobbler/Scrobbler';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

import type { ScrobbleService } from '@/background/scrobbler/service/ScrobbleService';
import type { ScrobblerSession } from '@/background/account/ScrobblerSession';

export class ListenBrainzScrobbler extends Scrobbler {
	constructor(protected session: ScrobblerSession, private apiUrl: string) {
		super(session);
	}

	getId(): ScrobblerId {
		return ScrobblerId.ListenBrainz;
	}

	getLabel(): string {
		return 'ListenBrainz';
	}

	getProfileUrl(): string {
		return `https://listenbrainz.org/user/${this.session.getName()}`;
	}

	getStatusUrl(): string {
		return 'https://listenbrainz.org/current-status';
	}

	createScrobbleService(): ScrobbleService {
		return new ListenBrainzScrobblerService(this.session, this.apiUrl);
	}
}
