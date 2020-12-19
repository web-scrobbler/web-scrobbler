import { Storage } from '@/background/storage2/Storage';

/**
 * Low-level storage cleaner.
 */
export interface StorageCleaner<S> {
	/**
	 * Perform a cleanup of the given storage.
	 *
	 * @param storage Storage to clean up
	 */
	clean(storage: Storage<S>): Promise<void>;
}
