import { SongInfo } from '@/background/object/song';
import { ApiCallResult } from '@/background/scrobbler/api-call-result';
import { Scrobbler } from '@/background/scrobbler/Scrobbler';
import { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';

export class ScrobblerManagerImpl implements ScrobblerManager {
	private scrobblers: Map<string, Scrobbler> = new Map<string, Scrobbler>();

	[Symbol.iterator](): IterableIterator<Scrobbler> {
		return this.scrobblers.values();
	}

	getScrobblerById(scroblerId: string): Scrobbler {
		if (this.scrobblers.has(scroblerId)) {
			return this.scrobblers.get(scroblerId);
		}

		throw new Error(`Unknown scrobbler ID: ${scroblerId}`);
	}

	addScrobbler(scrobbler: Scrobbler): void {
		this.scrobblers.set(scrobbler.getId(), scrobbler);
	}

	removeScrobbler(scrobblerId: string): void {
		this.scrobblers.delete(scrobblerId);
	}

	sendNowPlayingRequest(songInfo: SongInfo): Promise<ApiCallResult[]> {
		const scrobblers = Array.from(this.scrobblers.values());
		const promises = scrobblers.map((scrobbler) => {
			return scrobbler.sendNowPlayingRequest(songInfo);
		});

		return Promise.all(promises);
	}

	sendScrobbleRequest(songInfo: SongInfo): Promise<ApiCallResult[]> {
		const scrobblers = Array.from(this.scrobblers.values());
		const promises = scrobblers.map((scrobbler) => {
			return scrobbler.sendScrobbleRequest(songInfo);
		});

		return Promise.all(promises);
	}
}
