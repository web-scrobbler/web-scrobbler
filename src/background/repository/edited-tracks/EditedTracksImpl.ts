import type { EditedTrackInfo } from '@/background/repository/edited-tracks/EditedTrackInfo';
import type { EditedTracks } from './EditedTracks';
import type { EditedTracksRepositoryData } from './EditedTracksRepositoryData';
import type { Storage } from '@/background/storage2/Storage';

export class EditedTracksImpl implements EditedTracks {
	private editedTracksStorage: Storage<EditedTracksRepositoryData>;

	constructor(storage: Storage<EditedTracksRepositoryData>) {
		this.editedTracksStorage = storage;
	}

	getEditedTracks(): Promise<EditedTracksRepositoryData> {
		return this.editedTracksStorage.get();
	}

	async importEditedTracks(
		dataToImport: EditedTracksRepositoryData
	): Promise<void> {
		const existingData = await this.editedTracksStorage.get();

		return this.editedTracksStorage.set(
			Object.assign({}, existingData, dataToImport)
		);
	}

	async getSongInfo(songIds: Iterable<string>): Promise<EditedTrackInfo> {
		const editedTracks = await this.editedTracksStorage.get();

		for (const uniqueId of songIds) {
			if (uniqueId in editedTracks) {
				return editedTracks[uniqueId];
			}
		}

		return null;
	}

	async setSongInfo(
		songId: string,
		editedInfo: EditedTrackInfo
	): Promise<void> {
		return this.editedTracksStorage.update({
			[songId]: removeEmptyProperties(editedInfo),
		});
	}

	async deleteSongInfo(songId: string): Promise<void> {
		const editedTracks = await this.editedTracksStorage.get();

		delete editedTracks[songId];
		return this.editedTracksStorage.set(editedTracks);
	}

	async clear(): Promise<void> {
		return this.editedTracksStorage.clear();
	}
}

function removeEmptyProperties<T>(obj: T): T {
	const clone = { ...obj };

	Object.keys(clone).forEach((key) => {
		if (clone[key] && typeof clone[key] === 'object') {
			removeEmptyProperties(clone[key]);
		} else if (!clone[key]) {
			delete clone[key];
		}
	});

	return clone;
}
