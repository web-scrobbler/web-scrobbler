/**
 * A model to load/save song info to a storage.
 */
import MD5 from 'blueimp-md5';
import Song, { BaseSong } from '@/core/object/song';
import { CustomStorage } from '@/core/storage/custom-storage';
import { DataModels } from '@/core/storage/wrapper';
import { LOCAL_CACHE } from '@/core/storage/browser-storage';
import { SavedEdit } from '@/core/storage/options';

type K = typeof LOCAL_CACHE;
type V = DataModels[K];
type T = Record<K, V>;
export type TContent = T[K];

export default abstract class SavedEditsModel extends CustomStorage<K> {
	/**
	 * Public functions.
	 */

	/**
	 * Apply edited song info to a given song object.
	 *
	 * @param song - Song instance
	 * @returns True if data is loaded; false otherwise
	 */
	async loadSongInfo(song: Song): Promise<boolean> {
		let songId = SavedEditsModel.getSongId(song);
		const storageData = await this.getSongInfoStorage();

		if (!storageData || !(songId in storageData)) {
			songId = SavedEditsModel.makeSongId(song, [
				'artist',
				'track',
				'album',
			]);
		}

		if (!storageData || !(songId in storageData)) {
			songId = SavedEditsModel.makeSongId(song, ['artist', 'track']);
		}

		if (storageData && songId in storageData) {
			const loadedInfo = storageData[songId];
			SavedEditsModel.applyLoadedInfo(song, loadedInfo);

			return true;
		}

		return false;
	}

	/**
	 * Save custom song info to the storage.
	 *
	 * @param song - Song instance
	 * @param dataToSave - User data
	 */
	async saveSongInfo(song: BaseSong, dataToSave: SavedEdit): Promise<void> {
		const songId = SavedEditsModel.getSongId(song);
		const storageData = await this.getSongInfoStorage();
		if (storageData === null) {
			await this.saveSongInfoToStorage({
				[songId]: dataToSave,
			});
			return;
		}

		storageData[songId] = {
			...storageData[songId],
			...dataToSave,
		};

		await this.saveSongInfoToStorage(storageData);
	}

	/**
	 * Remove song info from the storage.
	 *
	 * @param song - Song object
	 */
	async removeSongInfo(song: Song | null): Promise<void> {
		if (song === null) {
			throw new Error('Song is null');
		}
		const songId = SavedEditsModel.getSongId(song);
		await this.removeSongInfoById(songId);
	}

	/**
	 * Remove song info from the storage.
	 *
	 * @param songId - Song ID
	 */
	async removeSongInfoById(songId: string): Promise<void> {
		const storageData = await this.getSongInfoStorage();
		if (storageData === null) {
			return;
		}

		delete storageData[songId];
		await this.saveSongInfoToStorage(storageData);
	}

	/**
	 * Functions must be implemented (overridden).
	 */

	/**
	 * Remove all song info from storage.
	 */
	public abstract clear(): Promise<void>;
	/**
	 * Return data of the song info storage.
	 *
	 * @returns Storage data
	 */
	public abstract getSongInfoStorage(): Promise<Record<
		string,
		SavedEdit
	> | null>;

	/**
	 * Save data to the song info storage.
	 */
	public abstract saveSongInfoToStorage(data: TContent): Promise<void>;

	/**
	 * Static functions.
	 */

	/**
	 * Apply loaded info to a given song.
	 *
	 * @param song - Song instance
	 * @param loadedInfo - Object containing loaded song info
	 */
	static applyLoadedInfo(song: Song, loadedInfo: SavedEdit): void {
		song.processed = {
			...song.processed,
			...loadedInfo,
		};
	}

	/**
	 * Get a song ID. If a song internal unique ID is missing,
	 * generate a new unique ID.
	 *
	 * @param song - Song instance
	 *
	 * @returns Song unique ID
	 */
	static getSongId(song: BaseSong): string {
		const uniqueId = song.getUniqueId();
		if (uniqueId) {
			return uniqueId;
		}

		return SavedEditsModel.makeSongId(song, Song.BASE_FIELDS);
	}

	/**
	 * Create an unique ID for a song based on song properties.
	 *
	 * @param song - Song instance
	 * @param properties - Array of properties
	 *
	 * @returns Generated unique ID
	 */
	static makeSongId(
		song: BaseSong,
		properties: (keyof Song['parsed'])[],
	): string {
		let inputStr = '';

		for (const field of properties) {
			if (song.parsed[field]) {
				inputStr += song.parsed[field];
			}
		}
		if (inputStr) {
			return MD5(inputStr);
		}

		throw new Error('Empty song');
	}
}
