import { BaseScrobbler } from '@/background/scrobbler/BaseScrobbler';
import { AudioScrobblerAppInfo } from '@/background/scrobbler/service/audioscrobbler/AudioScrobblerData';
import { AudioScrobblerScrobbleService } from '@/background/scrobbler/service/audioscrobbler/AudioScrobblerScrobbleService';
import { ScrobbleService } from '@/background/scrobbler/service/ScrobbleService';

export class LastFmScrobbler extends BaseScrobbler {
	getId(): string {
		return 'last-fm';
	}

	getLabel(): string {
		return 'Last.fm';
	}

	getProfileUrl(): string {
		return null;
	}

	getStatusUrl(): string {
		return null;
	}

	createScrobbleService(): ScrobbleService {
		const lastFmAppInfo: AudioScrobblerAppInfo = {
			apiUrl: 'https://ws.audioscrobbler.com/2.0/',
			apiKey: 'd9bb1870d3269646f740544d9def2c95',
			apiSecret: '2160733a567d4a1a69a73fad54c564b2',
		};
		const { session } = this.account;

		return new AudioScrobblerScrobbleService(session, lastFmAppInfo);
	}
}
