import { BaseScrobbler } from '@/background/scrobbler/BaseScrobbler';
import { ScrobbleService } from '@/background/scrobbler/service/ScrobbleService';

import { AudioScrobblerAppInfo } from '@/background/scrobbler/service/audioscrobbler/AudioScrobblerAppInfo';
import { AudioScrobblerScrobbleService } from '@/background/scrobbler/service/audioscrobbler/AudioScrobblerScrobbleService';

export class LastFmScrobbler extends BaseScrobbler {
	getId(): string {
		return 'last-fm';
	}

	getLabel(): string {
		return 'Last.fm';
	}

	getProfileUrl(): string {
		return `https://last.fm/user/${this.session.sessionName}`;
	}

	getStatusUrl(): string {
		return 'http://status.last.fm/';
	}

	createScrobbleService(): ScrobbleService {
		const lastFmAppInfo: AudioScrobblerAppInfo = {
			apiUrl: 'https://ws.audioscrobbler.com/2.0/',
			apiKey: 'd9bb1870d3269646f740544d9def2c95',
			apiSecret: '2160733a567d4a1a69a73fad54c564b2',
			authUrl: 'https://www.last.fm/api/auth/',
		};

		return new AudioScrobblerScrobbleService(this.session, lastFmAppInfo);
	}
}
