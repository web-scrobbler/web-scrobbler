import { Scrobbler } from '@/background/scrobbler/Scrobbler';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

import { AudioScrobblerScrobbleService } from '@/background/scrobbler/service/audioscrobbler/AudioScrobblerScrobbleService';
import { LastFmAppInfo } from '@/background/scrobbler/service/audioscrobbler/LastFmAppInfo';

import type { ScrobbleService } from '@/background/scrobbler/service/ScrobbleService';

export class LastFmScrobbler extends Scrobbler {
	getId(): ScrobblerId {
		return ScrobblerId.LastFm;
	}

	getLabel(): string {
		return 'Last.fm';
	}

	getProfileUrl(): string {
		return `https://last.fm/user/${this.session.getName()}`;
	}

	createScrobbleService(): ScrobbleService {
		return new AudioScrobblerScrobbleService(this.session, LastFmAppInfo);
	}
}
