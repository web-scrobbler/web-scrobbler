import { browser } from 'webextension-polyfill-ts';
import type { Storage as BrowserStorage } from 'webextension-polyfill-ts';

import { NamespaceStorage } from '@/background/storage3/namespace/NamespaceStorage';
import type { Storage } from '@/background/storage3/Storage';

/**
 * Create a local storage wrapped into NamespaceStorage object.
 *
 * @param namespace Storage namespace
 *
 * @return StorageWrapper instance
 */
export async function createLocalStorage<D>(
	namespace: string
): Promise<Storage<D>> {
	return createNamespaceStorage(browser.storage.local, namespace);
}

/**
 * Create a sync storage wrapped into NamespaceStorage object.
 *
 * @param namespace Storage namespace
 *
 * @return StorageWrapper instance
 */
export function createSyncStorage<D>(namespace: string): Promise<Storage<D>> {
	return createNamespaceStorage(browser.storage.sync, namespace);
}

async function createNamespaceStorage<D>(
	storageArea: BrowserStorage.StorageArea,
	namespace: string
): Promise<Storage<D>> {
	const initialData = (await storageArea.get(namespace))[namespace] as D;

	return new NamespaceStorage<D>(storageArea, initialData, namespace);
}
