import { Song } from '@/background/model/song/Song';
import { EditedTrackInfo } from '@/background/repository/edited-tracks/EditedTrackInfo';
import { Storage } from '@/background/storage2/Storage';
import { EditedTracks } from './EditedTracks';
import { EditedTracksRepositoryData } from './EditedTracksRepositoryData';

import { generateRepositoryKey, getRepositoryKey } from './RepositoryKey';

export class EditedTracksImpl implements EditedTracks {
	private editedTracksStorage: Storage<EditedTracksRepositoryData>;

	constructor(storage: Storage<EditedTracksRepositoryData>) {
		this.editedTracksStorage = storage;
	}

	async getSongInfo(song: Song): Promise<EditedTrackInfo> {
		const editedTracks = await this.editedTracksStorage.get();

		for (const repositoryKey of generateRepositoryKey(song)) {
			if (repositoryKey in editedTracks) {
				return editedTracks[repositoryKey];
			}
		}

		return null;
	}

	async setSongInfo(song: Song, editedInfo: EditedTrackInfo): Promise<void> {
		const repositoryKey = getRepositoryKey(song);
		return this.editedTracksStorage.update({
			[repositoryKey]: removeEmptyProperties(editedInfo),
		});
	}

	async deleteSongInfo(song: Song): Promise<void> {
		const repositoryKey = getRepositoryKey(song);
		const editedTracks = await this.editedTracksStorage.get();

		delete editedTracks[repositoryKey];
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
		} else if (clone[key] === undefined) {
			delete clone[key];
		}
	});

	return clone;
}
