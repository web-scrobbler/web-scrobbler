import { Storage } from '@/background/storage2/Storage';

/**
 * This class provides a base interface for custom storage wrappers.
 */
export abstract class CustomStorage {
	storageRef: Storage<unknown>;

	constructor() {
		this.storageRef = this.getStorage();
		/* @ifdef DEVELOPMENT */
		// this.storageRef.debugLog();
		/* @endif */
	}

	/**
	 * Return a reference to a storage object.
	 */
	abstract getStorage(): Storage<unknown>;

	/**
	 * Remove all data from the storage.
	 */
	async clear(): Promise<void> {
		return await this.storageRef.clear();
	}

	/**
	 * Return data from the storage.
	 *
	 * @return Storage data
	 */
	async getData(): Promise<unknown> {
		return await this.storageRef.get();
	}

	/**
	 * Overwrite a given data to the storage.
	 *
	 * @param data Data to save
	 * @return Storage data
	 */
	async saveData(data: unknown): Promise<void> {
		return await this.storageRef.set(data);
	}

	/**
	 * Append a given data in the storage.
	 *
	 * @param data Data to save
	 * @return Storage data
	 */
	async updateData(data: unknown): Promise<void> {
		return await this.storageRef.update(data);
	}
}
