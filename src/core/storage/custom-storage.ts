import type { DataModels } from '@/core/storage/wrapper';
import type StorageWrapper from '@/core/storage/wrapper';
import { debugLog } from '@/util/util';

/**
 * This class provides a base interface for custom storage wrappers.
 */
export abstract class CustomStorage<K extends keyof DataModels> {
	public storageRef: StorageWrapper<K> | null;

	constructor() {
		this.storageRef = null;
	}

	abstract init(): void;

	protected _init(storageRef: StorageWrapper<K>): void {
		this.storageRef = storageRef;

		// #v-ifdef VITE_DEV
		void this.storageRef.debugLog();
		// #v-endif
	}

	/**
	 * Return a reference to a storage object.
	 */
	abstract getStorage(): StorageWrapper<K>;

	/**
	 * Remove all data from the storage.
	 */
	async clear(): Promise<void> {
		if (!this.storageRef) {
			return;
		}
		return await this.storageRef.clear();
	}

	/**
	 * Return data from the storage.
	 *
	 * @returns Storage data
	 */
	async getData(): Promise<DataModels[K] | null> {
		if (!this.storageRef) {
			debugLog('Storage reference is not initialized', 'warn');
			return null;
		}
		return await this.storageRef.get();
	}

	/**
	 * Overwrite a given data to the storage.
	 *
	 * @param data - Data to save
	 * @returns Storage data
	 */
	async saveData(data: DataModels[K]): Promise<void> {
		if (!this.storageRef) {
			debugLog('Storage reference is not initialized', 'warn');
			return;
		}
		return await this.storageRef.set(data);
	}

	/**
	 * Append a given data in the storage.
	 *
	 * @param data - Data to save
	 * @returns Storage data
	 */
	async updateData(data: DataModels[K]): Promise<void> {
		if (!this.storageRef) {
			debugLog('Storage reference is not initialized', 'warn');
			return;
		}
		return await this.storageRef.update(data);
	}
}
