import { SongInfo } from '@/background/object/song';

import { Storage } from '@/background/storage2/Storage';
import { ScrobbleCache } from './ScrobbleCache';

import { createRepositoryKey } from '@/background/repository/scrobble-cache/CreateRepositoryKey';

export interface ScrobbleCacheEntry {
	scrobblerIds: string[];
	songInfo: SongInfo;
}

export interface ScrobbleCacheData {
	[cacheEntryId: string]: ScrobbleCacheEntry;
}

export class ScrobbleCacheImpl implements ScrobbleCache {
	private scrobbleCacheStorage: Storage<ScrobbleCacheData>;

	constructor(storage: Storage<ScrobbleCacheData>) {
		this.scrobbleCacheStorage = storage;
	}

	async addSong(songInfo: SongInfo, scrobblerIds: string[]): Promise<void> {
		const repositoryKey = createRepositoryKey();

		return this.scrobbleCacheStorage.update({
			[repositoryKey]: { songInfo, scrobblerIds },
		});
	}
}
