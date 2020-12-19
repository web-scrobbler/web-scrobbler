import { browser } from 'webextension-polyfill-ts';

import { NamespaceStorage } from '@/background/storage2/namespace/NamespaceStorage';
import { Storage } from '@/background/storage2/Storage';

/**
 * Create a local storage wrapped into NamespacedStorage object.
 *
 * @param namespace Storage namespace
 *
 * @return StorageWrapper instance
 */
export function createLocalStorage<T>(namespace: string): Storage<T> {
	return new NamespaceStorage<T>(browser.storage.local, namespace);
}

/**
 * Create a sync storage wrapped into NamespacedStorage object.
 *
 * @param namespace Storage namespace
 *
 * @return StorageWrapper instance
 */
export function createSyncStorage<T>(namespace: string): Storage<T> {
	return new NamespaceStorage<T>(browser.storage.sync, namespace);
}
