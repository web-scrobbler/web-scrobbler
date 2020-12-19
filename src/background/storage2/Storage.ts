/**
 * Base storage interface.
 */
export interface Storage<D> {
	/**
	 * Read data from storage.
	 *
	 * @return Storage data
	 */
	get(): Promise<D>;

	/**
	 * Save data to storage.
	 *
	 * @param data Data to save
	 */
	set(data: D): Promise<void>;

	/**
	 * Extend saved data by given one.
	 *
	 * @param data Data to add
	 */
	update(data: Partial<D>): Promise<void>;

	/**
	 * Clear storage.
	 */
	clear(): Promise<void>;
}
