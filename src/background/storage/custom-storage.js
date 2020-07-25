/**
 * This class provides a base interface for custom storage wrappers.
 */
export default class CustomStorage {
	constructor() {
		this.storageRef = this.getStorage();
		/* @ifdef DEVELOPMENT */
		this.storageRef.debugLog();
		/* @endif */
	}

	/**
	 * Return a reference to a storage object.
	 *
	 * Implementation must return a StorageWrapper object.
	 */
	getStorage() {
		throw new Error('This function must be overridden!');
	}

	/**
	 * Remove all data from the storage.
	 */
	async clear() {
		return await this.storageRef.clear();
	}

	/**
	 * Return data from the storage.
	 *
	 * @return {Object} Storage data
	 */
	async getData() {
		return await this.storageRef.get();
	}

	/**
	 * Overwrite a given data to the storage.
	 *
	 * @param {Object} data Data to save
	 * @return {Object} Storage data
	 */
	async saveData(data) {
		return await this.storageRef.set(data);
	}

	/**
	 * Append a given data in the storage.
	 *
	 * @param {Object} data Data to save
	 * @return {Object} Storage data
	 */
	async updateData(data) {
		return await this.storageRef.update(data);
	}
}
