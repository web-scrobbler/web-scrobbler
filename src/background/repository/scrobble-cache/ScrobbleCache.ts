import {
	createScrobbleableDto,
	Scrobbleable,
	ScrobbleableDto,
} from '@/background/scrobbler/Scrobbleable';
import { createRepositoryKey } from '@/background/repository/scrobble-cache/CreateRepositoryKey';

import type { Storage } from '@/background/storage2/Storage';
import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { ScrobbleCacheData } from './ScrobbleCacheData';
import { ScrobbleCacheEntry } from '@/background/repository/scrobble-cache/ScrobbleCacheEntry';

export class ScrobbleCache {
	constructor(private storage: Storage<ScrobbleCacheData>) {}

	async addSong(
		scrobbleable: Scrobbleable,
		scrobblerIds: ReadonlyArray<ScrobblerId>
	): Promise<void> {
		const repositoryKey = createRepositoryKey();
		const scrobbleableDto = createScrobbleableDto(scrobbleable);

		return this.storage.update({
			[repositoryKey]: { scrobbleable: scrobbleableDto, scrobblerIds },
		});
	}

	async clear(): Promise<void> {
		return this.storage.clear();
	}

	async delete(entryId: string): Promise<void> {
		const scrobbleCache = await this.storage.get();
		delete scrobbleCache[entryId];

		return this.storage.set(scrobbleCache);
	}

	async getTrack(entryId: string): Promise<ScrobbleCacheEntry> {
		const scrobbleCache = await this.storage.get();
		return scrobbleCache[entryId] ?? null;
	}

	async getUnscrobbledTracks(): Promise<ScrobbleCacheData> {
		return this.storage.get();
	}

	async importUnscrobbledTracks(
		dataToImport: ScrobbleCacheData
	): Promise<void> {
		const existingData = await this.storage.get();

		return this.storage.set(Object.assign({}, existingData, dataToImport));
	}

	async updateTrackInfo(
		entryId: string,
		scrobbleable: ScrobbleableDto
	): Promise<void> {
		const scrobbleCache = await this.storage.get();
		if (!(entryId in scrobbleCache)) {
			return;
		}

		const { scrobblerIds } = scrobbleCache[entryId];
		return this.storage.update({
			[entryId]: { scrobbleable, scrobblerIds },
		});
	}

	async updateScrobblerIds(
		entryId: string,
		scrobblerIds: ReadonlyArray<ScrobblerId>
	): Promise<void> {
		const scrobbleCache = await this.storage.get();
		if (!(entryId in scrobbleCache)) {
			return;
		}

		const { scrobbleable } = scrobbleCache[entryId];
		return this.storage.update({
			[entryId]: { scrobbleable, scrobblerIds },
		});
	}
}
