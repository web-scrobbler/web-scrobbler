import CustomStorage from '@/background/storage/custom-storage';

import { SongInfo } from '@/background/object/song';

export interface ScrobblerStorageEntry {
	scrobblerIds: string[];
	songInfo: SongInfo;
}

export interface ScrobbleStorageData {
	[entryId: string]: ScrobblerStorageEntry;
}

export default abstract class ScrobbleStorageModel extends CustomStorage {
	/* Public methods */

	async addSong(songInfo: SongInfo, scrobblerIds: string[]): Promise<void> {
		const storageData = (await this.getData()) as ScrobbleStorageData;
		const entryId = ScrobbleStorageModel.generateEntryId();

		storageData[entryId] = { scrobblerIds, songInfo };
		await this.saveData(storageData);
	}

	static generateEntryId(): string {
		const uniqueNumber = Date.now();
		return `id-${uniqueNumber}`;
	}
}
