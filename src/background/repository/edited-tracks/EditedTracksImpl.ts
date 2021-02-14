import { Song } from '@/background/model/song/Song';
import { EditedTrackInfo } from '@/background/repository/edited-tracks/EditedTrackInfo';
import { Storage } from '@/background/storage2/Storage';
import { EditedTracks } from './EditedTracks';
import { EditedTracksRepositoryData } from './EditedTracksRepositoryData';

export class EditedTracksImpl implements EditedTracks {
	private editedTracksStorage: Storage<EditedTracksRepositoryData>;

	constructor(storage: Storage<EditedTracksRepositoryData>) {
		this.editedTracksStorage = storage;
	}

	async getSongInfo(song: Song): Promise<EditedTrackInfo> {
		const editedTracks = await this.editedTracksStorage.get();

		for (const uniqueId of song.generateUniqueIds()) {
			if (uniqueId in editedTracks) {
				return editedTracks[uniqueId];
			}
		}

		return null;
	}

	async setSongInfo(song: Song, editedInfo: EditedTrackInfo): Promise<void> {
		const uniqueId = song.getUniqueId();
		return this.editedTracksStorage.update({
			[uniqueId]: removeEmptyProperties(editedInfo),
		});
	}

	async deleteSongInfo(song: Song): Promise<void> {
		const uniqueId = song.getUniqueId();
		const editedTracks = await this.editedTracksStorage.get();

		delete editedTracks[uniqueId];
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
