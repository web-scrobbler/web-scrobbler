import {
	ApiCallResult,
	ApiCallResultType,
} from '@/background/scrobbler/api-call-result';

import type { LoveStatus } from '@/background/model/song/LoveStatus';
import type { ScrobbleService } from '@/background/scrobbler/ScrobbleService';
import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { ScrobblerSession } from '@/background/account/ScrobblerSession';
import type { TrackInfo } from '@/background/model/song/TrackInfo';
import type { ScrobblerInfo } from '@/background/scrobbler/ScrobblerInfo';
import { TrackContextInfo } from '@/background/model/song/TrackContextInfo';

export class Scrobbler {
	constructor(
		private session: ScrobblerSession,
		private scrobblerInfo: ScrobblerInfo,
		private scrobbleService: ScrobbleService
	) {}

	getId(): ScrobblerId {
		return this.scrobblerInfo.id;
	}

	getProfileUrl(): string {
		const baseProfileUrl = this.scrobblerInfo.baseProfileUrl;
		if (baseProfileUrl) {
			return `${baseProfileUrl}/${this.session.getName()}`;
		}

		return this.scrobblerInfo.profileUrl ?? null;
	}

	async getTrackContextInfo(trackInfo: TrackInfo): Promise<TrackContextInfo> {
		return this.scrobbleService.getTrackContextInfo(trackInfo);
	}

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

	private createApiCallResult(resultType: ApiCallResultType): ApiCallResult {
		return new ApiCallResult(resultType, this.getId());
	}
}
