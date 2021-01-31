/**
 * Base storage interface with synchronous access.
 */
export interface Storage<D> {
	/**
	 * Read data from storage.
	 *
	 * @return Storage data
	 */
	get(): D;

	/**
	 * Save data to storage.
	 *
	 * @param data Data to save
	 */
	set(data: D): void;

	/**
	 * Extend saved data by given one.
	 *
	 * @param data Data to add
	 */
	update(data: Partial<D>): void;

	/**
	 * Clear storage.
	 */
	clear(): void;
}
