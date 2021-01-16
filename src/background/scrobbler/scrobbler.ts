import {
	ApiCallResult,
	ApiCallResultType,
} from '@/background/scrobbler/api-call-result';

import type { LoveStatus } from '@/background/model/song/LoveStatus';
import type { ScrobbleService } from '@/background/scrobbler/service/ScrobbleService';
import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { ScrobblerInfoProvider } from '@/background/scrobbler/ScrobblerInfoProvider';
import type { Session } from '@/background/account/Session';
import type { TrackInfo } from '@/background/model/song/TrackInfo';

export abstract class Scrobbler implements ScrobblerInfoProvider {
	protected session: Session;
	private scrobbleService: ScrobbleService;

	constructor(session: Session) {
		this.session = session;
		this.scrobbleService = this.createScrobbleService();
	}

	abstract getId(): ScrobblerId;
	abstract getLabel(): string;
	abstract getProfileUrl(): string;
	abstract getStatusUrl(): string;

	abstract createScrobbleService(): ScrobbleService;

	async sendNowPlayingRequest(trackInfo: TrackInfo): Promise<ApiCallResult> {
		try {
			await this.scrobbleService.sendNowPlayingRequest(trackInfo);
			return this.createApiCallResult(ApiCallResult.RESULT_OK);
		} catch (err) {
			throw this.createApiCallResult(ApiCallResult.ERROR_OTHER);
		}
	}

	async sendScrobbleRequest(trackInfo: TrackInfo): Promise<ApiCallResult> {
		try {
			await this.scrobbleService.sendScrobbleRequest(trackInfo);
			return this.createApiCallResult(ApiCallResult.RESULT_OK);
		} catch (err) {
			throw this.createApiCallResult(ApiCallResult.ERROR_OTHER);
		}
	}

	async sendLoveRequest(
		trackInfo: TrackInfo,
		loveStatus: LoveStatus
	): Promise<ApiCallResult> {
		try {
			await this.scrobbleService.sendLoveRequest(trackInfo, loveStatus);
			return this.createApiCallResult(ApiCallResult.RESULT_OK);
		} catch (err) {
			throw this.createApiCallResult(ApiCallResult.ERROR_OTHER);
		}
	}

	protected createApiCallResult(
		resultType: ApiCallResultType
	): ApiCallResult {
		return new ApiCallResult(resultType, this.getId());
	}
}
