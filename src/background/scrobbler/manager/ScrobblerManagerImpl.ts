import type { ApiCallResult } from '@/background/scrobbler/api-call-result';
import type { Scrobbler } from '@/background/scrobbler/Scrobbler';
import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';
import type { SongInfo } from '@/background/object/song';

import Logger, { ILogger } from 'js-logger';

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

	sendNowPlayingRequest(songInfo: SongInfo): Promise<ApiCallResult[]> {
		this.logger.info('Send "now playing" request');

		const scrobblers = Array.from(this.scrobblers.values());
		const promises = scrobblers.map((scrobbler) => {
			return scrobbler.sendNowPlayingRequest(songInfo);
		});

		return Promise.all(promises);
	}

	sendScrobbleRequest(songInfo: SongInfo): Promise<ApiCallResult[]> {
		this.logger.info('Send "scrobble" request');

		const scrobblers = Array.from(this.scrobblers.values());
		const promises = scrobblers.map((scrobbler) => {
			return scrobbler.sendScrobbleRequest(songInfo);
		});

		return Promise.all(promises);
	}
}
