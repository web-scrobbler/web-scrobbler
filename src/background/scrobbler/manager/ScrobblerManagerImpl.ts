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
		this.logger.info(`Use scrobbler with "${scrobbler.getId()}" ID`);

		this.scrobblers.set(scrobbler.getId(), scrobbler);
	}

	removeScrobbler(scrobblerId: ScrobblerId): void {
		this.logger.info(`Remove scrobbler with "${scrobblerId}" ID`);

		this.scrobblers.delete(scrobblerId);
		console.log(this.scrobblers);
	}

	getTrackContextInfo(trackInfo: TrackInfo): Promise<TrackContextInfo[]> {
		this.logger.info('Send "get info" request');

		return this.executeRequests((scrobbler) => {
			return scrobbler.getTrackContextInfo(trackInfo);
		});
	}

	sendNowPlayingRequest(trackInfo: TrackInfo): Promise<ApiCallResult[]> {
		this.logger.info('Send "now playing" request');

		return this.executeRequests((scrobbler) => {
			return scrobbler.sendNowPlayingRequest(trackInfo);
		});
	}

	sendScrobbleRequest(trackInfo: TrackInfo): Promise<ApiCallResult[]> {
		this.logger.info('Send "scrobble" request');

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
