import { REGEX_EDITS } from './browser-storage';
import { CustomStorage } from './custom-storage';
import { DataModels } from './wrapper';
import {
	RegexEdit,
	RegexFields,
	editSong,
	shouldApplyEdit,
} from '@/util/regex';
import Song from '../object/song';

type K = typeof REGEX_EDITS;
type V = DataModels[K];
type T = Record<K, V>;

export default abstract class RegexEditsModel extends CustomStorage<K> {
	public abstract getRegexEditStorage(): Promise<RegexEdit[] | null>;
	public abstract saveRegexEditToStorage(data: T[K]): Promise<void>;

	/**
	 * Apply regex edits to a given song object.
	 *
	 * @param song - Song instance
	 */
	async loadSongInfo(song: Song): Promise<void> {
		const storageData = await this.getRegexEditStorage();

		if (!storageData) {
			return;
		}

		for (let i = storageData.length - 1; i >= 0; i--) {
			if (!shouldApplyEdit(storageData[i], song)) {
				continue;
			}
			editSong(storageData[i], song);
		}
	}

	/**
	 * Save custom regex edit to the storage.
	 *
	 * @param search - Search to save
	 * @param replace - Replace to save
	 */
	async saveRegexEdit(newEdit: RegexEdit): Promise<void> {
		/**
		 * The edit here might be from a solidjs store, which is a proxy.
		 * Firefox does not like this, so we ensure an explicit shallow copy to regular objects.
		 * It looks odd, but removing this will break firefox support.
		 */
		newEdit.search = {
			...newEdit.search,
		};
		newEdit.replace = {
			...newEdit.replace,
		};
		const storageData = await this.getRegexEditStorage();
		if (storageData === null) {
			await this.saveRegexEditToStorage([newEdit]);
			return;
		}

		const newStorageData = [...storageData, newEdit];

		await this.saveRegexEditToStorage(newStorageData);
	}

	async deleteRegexEdit(index: number): Promise<void> {
		const storageData = await this.getRegexEditStorage();
		if (storageData === null) {
			return;
		}
		storageData.splice(index, 1);

		await this.saveRegexEditToStorage(storageData);
	}
}
