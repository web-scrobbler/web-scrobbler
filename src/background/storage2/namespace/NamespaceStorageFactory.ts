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
export function createLocalStorage<D>(namespace: string): Storage<D> {
	return new NamespaceStorage<D>(browser.storage.local, namespace);
}

/**
 * Create a sync storage wrapped into NamespacedStorage object.
 *
 * @param namespace Storage namespace
 *
 * @return StorageWrapper instance
 */
export function createSyncStorage<D>(namespace: string): Storage<D> {
	return new NamespaceStorage<D>(browser.storage.sync, namespace);
}
