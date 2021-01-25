import type { ApiCallResult } from '@/background/scrobbler/api-call-result';
import type { Scrobbler } from '@/background/scrobbler/Scrobbler';
import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';

import Logger, { ILogger } from 'js-logger';
import { TrackInfo } from '@/background/model/song/TrackInfo';
import { LoveStatus } from '@/background/model/song/LoveStatus';
import { TrackContextInfo } from '@/background/model/song/TrackContextInfo';

export class ScrobblerManagerImpl implements ScrobblerManager {
	private logger: ILogger;
	private scrobblers: Map<ScrobblerId, Scrobbler> = new Map<
		ScrobblerId,
		Scrobbler
	>();

	constructor() {
		this.logger = Logger.get('ScrobbleManager');
	}

	[Symbol.iterator](): IterableIterator<Scrobbler> {
		return this.scrobblers.values();
	}

	getScrobblerById(scroblerId: ScrobblerId): Scrobbler {
		return this.scrobblers.get(scroblerId);
	}

	useScrobbler(scrobbler: Scrobbler): void {
		const scrobblerId = scrobbler.getId();
		if (this.scrobblers.has(scrobblerId)) {
			this.logger.info(`Replace "${scrobblerId}" scrobbler`);
		} else {
			this.logger.info(`Use "${scrobblerId}" scrobbler`);
		}

		this.scrobblers.set(scrobblerId, scrobbler);
	}

	removeScrobbler(scrobblerId: ScrobblerId): void {
		if (!this.scrobblers.has(scrobblerId)) {
			this.logger.warn(
				`Attempt to remove missing "${scrobblerId}" scrobbler`
			);
			return;
		}

		this.logger.info(`Remove "${scrobblerId}" scrobbler`);

		this.scrobblers.delete(scrobblerId);
	}

	getTrackContextInfo(trackInfo: TrackInfo): Promise<TrackContextInfo[]> {
		this.logger.info('Send "get info" request:', this.scrobblers.size);

		return this.executeRequests((scrobbler) => {
			return scrobbler.getTrackContextInfo(trackInfo);
		});
	}

	sendNowPlayingRequest(trackInfo: TrackInfo): Promise<ApiCallResult[]> {
		this.logger.info('Send "now playing" request:', this.scrobblers.size);

		return this.executeRequests((scrobbler) => {
			return scrobbler.sendNowPlayingRequest(trackInfo);
		});
	}

	sendScrobbleRequest(trackInfo: TrackInfo): Promise<ApiCallResult[]> {
		this.logger.info('Send "scrobble" request:', this.scrobblers.size);

		return this.executeRequests((scrobbler) => {
			return scrobbler.sendScrobbleRequest(trackInfo);
		});
	}

	sendLoveRequest(
		trackInfo: TrackInfo,
		loveStatus: LoveStatus
	): Promise<ApiCallResult[]> {
		this.logger.info('Send "love" request');

		return this.executeRequests((scrobbler) => {
			return scrobbler.sendLoveRequest(trackInfo, loveStatus);
		});
	}

	private executeRequests<T>(
		fn: (scrobbler: Scrobbler) => Promise<T>
	): Promise<T[]> {
		const requests = Array.from(this.scrobblers.values()).map(fn);
		return Promise.all(requests);
	}
}
