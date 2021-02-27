import {
	TrackIdPayload,
	ImportUnscrobbledTracksPayload,
	ScrobbleCacheMessageType,
	UpdateTrackInfoPayload,
} from '@/communication/scrobble-cache/ScrobbleCacheMessageType';
import { assertUnreachable, isInEnum } from '@/background/util/util';

import type { CommunicationWorker } from '@/communication/CommunicationWorker';
import type { Message } from '@/communication/message/Message';
import type { ScrobbleCache } from '@/background/repository/scrobble-cache/ScrobbleCache';
import type { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';
import { createScrobbleableFromDto } from '@/background/scrobbler/Scrobbleable';
import {
	ScrobblerResult,
	ScrobblerResultType,
} from '@/background/scrobbler/ScrobblerResult';

export class ScrobbleCacheWorker
	implements CommunicationWorker<ScrobbleCacheMessageType> {
	constructor(
		private scrobbleCache: ScrobbleCache,
		private scrobblerManager: ScrobblerManager
	) {}

	processMessage(
		message: Message<ScrobbleCacheMessageType, unknown>
	): Promise<unknown> {
		switch (message.type) {
			case ScrobbleCacheMessageType.ClearUnscrobbledTracks: {
				return this.scrobbleCache.clear();
			}

			case ScrobbleCacheMessageType.GetUnscrobbledTracks: {
				return this.scrobbleCache.getUnscrobbledTracks();
			}

			case ScrobbleCacheMessageType.GetTrack: {
				const { entryId } = message.data as TrackIdPayload;
				return this.scrobbleCache.getTrack(entryId);
			}

			case ScrobbleCacheMessageType.DeleteUnscrobbledTrack: {
				const { entryId } = message.data as TrackIdPayload;
				return this.scrobbleCache.delete(entryId);
			}

			case ScrobbleCacheMessageType.ImportEditedTracks: {
				const {
					scrobbleCache,
				} = message.data as ImportUnscrobbledTracksPayload;

				return this.scrobbleCache.importUnscrobbledTracks(
					scrobbleCache
				);
			}

			case ScrobbleCacheMessageType.ScrobbleTrack: {
				const { entryId } = message.data as TrackIdPayload;

				return this.scrobbleTrack(entryId);
			}

			case ScrobbleCacheMessageType.UpdateTrackInfo: {
				const {
					entryId,
					trackInfo,
				} = message.data as UpdateTrackInfoPayload;
				return this.scrobbleCache.updateTrackInfo(entryId, trackInfo);
			}

			default: {
				return assertUnreachable(message.type);
			}
		}
	}

	canProcessMessage(message: Message<unknown, unknown>): boolean {
		return isInEnum(message.type, ScrobbleCacheMessageType);
	}

	private async scrobbleTrack(entryId: string): Promise<void> {
		const data = await this.scrobbleCache.getTrack(entryId);
		if (!data) {
			return;
		}

		const { scrobbleable, scrobblerIds } = data;

		const results = await this.scrobblerManager.sendScrobbleRequest(
			createScrobbleableFromDto(scrobbleable),
			scrobblerIds
		);

		return this.processScrobblerResults(entryId, results);
	}

	private async processScrobblerResults(
		entryId: string,
		results: ReadonlyArray<ScrobblerResult>
	): Promise<void> {
		const okScrobblersIds = [];
		const failedScrobblerIds = [];

		for (const result of results) {
			const scrobblerId = result.getScrobblerId();

			if (result.is(ScrobblerResultType.OK)) {
				okScrobblersIds.push(scrobblerId);
			} else {
				failedScrobblerIds.push(scrobblerId);
			}
		}

		const areAllResultsOk = okScrobblersIds.length === results.length;
		if (areAllResultsOk) {
			await this.scrobbleCache.delete(entryId);
		} else {
			const isNeedToUpdateScrobblerIds = okScrobblersIds.length > 0;

			if (isNeedToUpdateScrobblerIds) {
				await this.scrobbleCache.updateScrobblerIds(
					entryId,
					failedScrobblerIds
				);
			}
		}
	}
}
