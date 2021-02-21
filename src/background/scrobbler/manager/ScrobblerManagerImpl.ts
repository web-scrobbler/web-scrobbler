import type { ScrobblerResult } from '@/background/scrobbler/ScrobblerResult';
import type { Logger } from '@/background/util/Logger';
import type { Scrobbler } from '@/background/scrobbler/Scrobbler';
import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';

import { LoveStatus } from '@/background/model/song/LoveStatus';
import { TrackContextInfo } from '@/background/scrobbler/TrackContextInfo';
import { Scrobbleable } from '@/background/scrobbler/Scrobbleable';

export class ScrobblerManagerImpl implements ScrobblerManager {
	private scrobblers: Map<ScrobblerId, Scrobbler> = new Map<
		ScrobblerId,
		Scrobbler
	>();

	constructor(private logger: Logger) {}

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

	getTrackContextInfo(
		scrobbleable: Scrobbleable
	): Promise<TrackContextInfo[]> {
		this.logger.info('Send "get info" request:', this.scrobblers.size);

		return this.executeRequests((scrobbler) => {
			return scrobbler.getTrackContextInfo(scrobbleable);
		});
	}

	sendNowPlayingRequest(
		scrobbleEntity: Scrobbleable
	): Promise<ScrobblerResult[]> {
		this.logger.info('Send "now playing" request:', this.scrobblers.size);

		return this.executeRequests((scrobbler) => {
			return scrobbler.sendNowPlayingRequest(scrobbleEntity);
		});
	}

	sendScrobbleRequest(
		scrobbleEntity: Scrobbleable
	): Promise<ScrobblerResult[]> {
		this.logger.info('Send "scrobble" request:', this.scrobblers.size);

		return this.executeRequests((scrobbler) => {
			return scrobbler.sendScrobbleRequest(scrobbleEntity);
		});
	}

	sendLoveRequest(
		scrobbleEntity: Scrobbleable,
		loveStatus: LoveStatus
	): Promise<ScrobblerResult[]> {
		this.logger.info('Send "love" request');

		return this.executeRequests((scrobbler) => {
			return scrobbler.sendLoveRequest(scrobbleEntity, loveStatus);
		});
	}

	private executeRequests<T>(
		fn: (scrobbler: Scrobbler) => Promise<T>
	): Promise<T[]> {
		const requests = Array.from(this.scrobblers.values()).map(fn);
		return Promise.all(requests);
	}
}
