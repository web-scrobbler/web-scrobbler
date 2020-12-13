/**
 * Base storage interface.
 */
export interface Storage<T> {
	/**
	 * Read data from storage.
	 *
	 * @return Storage data
	 */
	get(): Promise<T>;

	/**
	 * Save data to storage.
	 *
	 * @param data Data to save
	 */
	set(data: T): Promise<void>;

	/**
	 * Extend saved data by given one.
	 *
	 * @param data Data to add
	 */
	update(data: Partial<T>): Promise<void>;

	/**
	 * Clear storage.
	 */
	clear(): Promise<void>;
}
