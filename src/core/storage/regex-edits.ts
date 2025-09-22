import type { DataModels } from './wrapper';
import type StorageWrapper from './wrapper';
import { getLocalStorage, getStorage } from './browser-storage';
import { REGEX_EDITS } from './storage-constants';
import type { RegexEdit } from '@/util/regex';
import RegexEditsModel from './regex-edits.model';

type K = typeof REGEX_EDITS;
type V = DataModels[K];
type T = Record<K, V>;

class RegexEditsImpl extends RegexEditsModel {
	private regexEditStorage = this.getStorage();

	public init() {
		this._init(getLocalStorage(REGEX_EDITS));

		// #v-ifdef VITE_DEV
		void this.regexEditStorage.debugLog();
		// #v-endif
	}

	/** @override */
	async getRegexEditStorage(): Promise<RegexEdit[] | null> {
		return this.regexEditStorage.get();
	}

	/** @override */
	async saveRegexEditToStorage(data: T[K]): Promise<void> {
		return await this.regexEditStorage.set(data);
	}

	/** @override */
	getStorage(): StorageWrapper<K> {
		return getStorage(REGEX_EDITS);
	}
}

export default new RegexEditsImpl();
