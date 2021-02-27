import { ScrobbleCacheMessageType } from '@/communication/scrobble-cache/ScrobbleCacheMessageType';

import type { ScrobbleCacheData } from '@/background/repository/scrobble-cache/ScrobbleCacheData';
import type { MessageSender } from '@/communication/MessageSender';
import { ScrobbleCacheEntry } from '@/background/repository/scrobble-cache/ScrobbleCacheEntry';
import { ScrobbleableDto } from '@/background/scrobbler/Scrobbleable';

export class ScrobbleCacheCommunicator {
	constructor(private sender: MessageSender<ScrobbleCacheMessageType>) {}

	clearUnscrobbledTracks(): Promise<void> {
		return this.sender.sendMessage({
			type: ScrobbleCacheMessageType.ClearUnscrobbledTracks,
		});
	}

	deleteUnscrobbledTrack(entryId: string): Promise<void> {
		return this.sender.sendMessage({
			type: ScrobbleCacheMessageType.DeleteUnscrobbledTrack,
			data: { entryId },
		});
	}

	getTrack(entryId: string): Promise<ScrobbleCacheEntry> {
		return this.sender.sendMessage({
			type: ScrobbleCacheMessageType.GetTrack,
			data: { entryId },
		});
	}

	getUnscrobbledTracks(): Promise<ScrobbleCacheData> {
		return this.sender.sendMessage({
			type: ScrobbleCacheMessageType.GetUnscrobbledTracks,
		});
	}

	importUnscrobbledTracks(scrobbleCache: ScrobbleCacheData): Promise<void> {
		return this.sender.sendMessage({
			type: ScrobbleCacheMessageType.ImportEditedTracks,
			data: { scrobbleCache },
		});
	}

	scrobbleTrack(entryId: string): Promise<void> {
		return this.sender.sendMessage({
			type: ScrobbleCacheMessageType.ScrobbleTrack,
			data: { entryId },
		});
	}

	updateTrackInfo(
		entryId: string,
		trackInfo: ScrobbleableDto
	): Promise<void> {
		return this.sender.sendMessage({
			type: ScrobbleCacheMessageType.UpdateTrackInfo,
			data: { entryId, trackInfo },
		});
	}
}
