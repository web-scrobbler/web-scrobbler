import { ListenBrainzScrobblerService } from '@/background/scrobbler/service/listenbrainz/ListenBrainzScrobblerService';

import { Scrobbler } from '@/background/scrobbler/Scrobbler';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

import type { ScrobbleService } from '@/background/scrobbler/service/ScrobbleService';
import type { Session } from '@/background/account/Session';

export class ListenBrainzScrobbler extends Scrobbler {
	constructor(protected session: Session, private apiUrl: string) {
		super(session);
	}

	getId(): ScrobblerId {
		return ScrobblerId.ListenBrainz;
	}

	getLabel(): string {
		return 'ListenBrainz';
	}

	getProfileUrl(): string {
		return `https://last.fm/user/${this.session.sessionName}`;
	}

	getStatusUrl(): string {
		return 'http://status.last.fm/';
	}

	createScrobbleService(): ScrobbleService {
		return new ListenBrainzScrobblerService(this.session, this.apiUrl);
	}
}
