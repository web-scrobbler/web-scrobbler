import { Session } from '@/background/account/Session';
import { LoveStatus } from '@/background/model/song/LoveStatus';
import { TrackInfo } from '@/background/model/song/TrackInfo';
import { ApiCallResult } from '@/background/scrobbler/api-call-result';
import { Scrobbler } from '@/background/scrobbler/Scrobbler';
import { ScrobbleService } from '@/background/scrobbler/service/ScrobbleService';

export abstract class BaseScrobbler implements Scrobbler {
	protected session: Session;
	private scrobbleService: ScrobbleService;

	constructor(session: Session) {
		this.session = session;
		this.scrobbleService = this.createScrobbleService();
	}

	abstract getId(): string;
	abstract getLabel(): string;
	abstract getProfileUrl(): string;
	abstract getStatusUrl(): string;

	abstract createScrobbleService(): ScrobbleService;

	sendNowPlayingRequest(trackInfo: TrackInfo): Promise<ApiCallResult> {
		return this.scrobbleService.sendNowPlayingRequest(trackInfo);
	}

	sendScrobbleRequest(trackInfo: TrackInfo): Promise<ApiCallResult> {
		return this.scrobbleService.sendScrobbleRequest(trackInfo);
	}

	sendLoveRequest(
		trackInfo: TrackInfo,
		loveStatus: LoveStatus
	): Promise<ApiCallResult> {
		return this.scrobbleService.sendLoveRequest(trackInfo, loveStatus);
	}
}
