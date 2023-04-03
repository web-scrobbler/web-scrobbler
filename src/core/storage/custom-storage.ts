import StorageWrapper, { DataModels } from '@/core/storage/wrapper';

/**
 * This class provides a base interface for custom storage wrappers.
 */
export abstract class CustomStorage<K extends keyof DataModels> {
	public storageRef: StorageWrapper<K>;

	constructor(storageRef: StorageWrapper<K>) {
		this.storageRef = storageRef;
		/* @ifdef DEVELOPMENT */
		void this.storageRef.debugLog();
		/* @endif */
	}

	/**
	 * Return a reference to a storage object.
	 */
	abstract getStorage(): StorageWrapper<K>;

	/**
	 * Remove all data from the storage.
	 */
	async clear(): Promise<void> {
		return await this.storageRef.clear();
	}

	/**
	 * Return data from the storage.
	 *
	 * @returns Storage data
	 */
	async getData(): Promise<DataModels[K] | null> {
		return await this.storageRef.get();
	}

	/**
	 * Overwrite a given data to the storage.
	 *
	 * @param data - Data to save
	 * @returns Storage data
	 */
	async saveData(data: DataModels[K]): Promise<void> {
		return await this.storageRef.set(data);
	}

	/**
	 * Append a given data in the storage.
	 *
	 * @param data - Data to save
	 * @returns Storage data
	 */
	async updateData(data: DataModels[K]): Promise<void> {
		return await this.storageRef.update(data);
	}
}
