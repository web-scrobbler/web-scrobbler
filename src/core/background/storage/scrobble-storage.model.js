'use strict';

define((require) => {
	const CustomStorage = require('storage/custom-storage');

	class ScrobbleStorageModel extends CustomStorage {
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

	return ScrobbleStorageModel;
});
