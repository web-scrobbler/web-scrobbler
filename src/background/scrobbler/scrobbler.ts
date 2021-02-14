import {
	ScrobblerResult,
	ScrobblerResultType,
} from '@/background/scrobbler/ScrobblerResult';

import type { LoveStatus } from '@/background/model/song/LoveStatus';
import type { ScrobbleEntity } from '@/background/scrobbler/ScrobbleEntity';
import type { ScrobbleService } from '@/background/scrobbler/ScrobbleService';
import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { ScrobblerInfo } from '@/background/scrobbler/ScrobblerInfo';
import type { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';
import type { TrackContextInfo } from '@/background/scrobbler/TrackContextInfo';

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

	async getTrackContextInfo(
		scrobbleEntity: ScrobbleEntity
	): Promise<TrackContextInfo> {
		try {
			return this.scrobbleService.getTrackContextInfo(scrobbleEntity);
		} catch {
			return null;
		}
	}

	async sendNowPlayingRequest(
		scrobbleEntity: ScrobbleEntity
	): Promise<ScrobblerResult> {
		try {
			await this.scrobbleService.sendNowPlayingRequest(scrobbleEntity);
			return this.createResult(ScrobblerResultType.OK);
		} catch (err) {
			return this.createResult(ScrobblerResultType.ERROR_OTHER);
		}
	}

	async sendScrobbleRequest(
		scrobbleEntity: ScrobbleEntity
	): Promise<ScrobblerResult> {
		try {
			await this.scrobbleService.sendScrobbleRequest(scrobbleEntity);
			return this.createResult(ScrobblerResultType.OK);
		} catch (err) {
			return this.createResult(ScrobblerResultType.ERROR_OTHER);
		}
	}

	async sendLoveRequest(
		scrobbleEntity: ScrobbleEntity,
		loveStatus: LoveStatus
	): Promise<ScrobblerResult> {
		try {
			await this.scrobbleService.sendLoveRequest(
				scrobbleEntity,
				loveStatus
			);
			return this.createResult(ScrobblerResultType.OK);
		} catch (err) {
			return this.createResult(ScrobblerResultType.ERROR_OTHER);
		}
	}

	private createResult(resultType: ScrobblerResultType): ScrobblerResult {
		return new ScrobblerResult(resultType, this.getId());
	}
}
