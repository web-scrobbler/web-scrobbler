import CustomStorage from '@/background/storage/custom-storage';

export default class ScrobbleStorageModel extends CustomStorage {
	/* Public methods */

	async addSong(songInfo, scrobblerIds) {
		const storageData = await this.getData();
		const entryId = ScrobbleStorageModel.generateEntryId();

		storageData[entryId] = { scrobblerIds, songInfo };
		await this.saveData(storageData);
	}

	/* Static methods */

	static generateEntryId() {
		const uniqueNumber = Date.now();
		return `id-${uniqueNumber}`;
	}
}
