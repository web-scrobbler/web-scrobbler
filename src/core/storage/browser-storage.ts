import {
	LOCAL,
	SYNC,
	storageTypeMap,
	StorageNamespace,
} from './storage-constants';

import browser from 'webextension-polyfill';
import type { DataModels } from '@/core/storage/wrapper';
import StorageWrapper from '@/core/storage/wrapper';

/**
 * Return storage by given namespace according storage type map.
 * @param namespace - Storage namespace
 * @returns StorageWrapper instance
 * @throws if unknown namespace is specified
 */
export function getStorage<K extends StorageNamespace>(
	namespace: K,
): StorageWrapper<K> {
	const storageType = storageTypeMap[namespace];
	switch (storageType) {
		case SYNC:
			return getSyncStorage(namespace);
		case LOCAL:
			return getLocalStorage(namespace);
		default:
			throw new Error(`Unknown storage namespace: ${namespace}`);
	}
}

/**
 * Return storage by given scrobbler storage namespace.
 * @param namespace - Scrobbler storage namespace
 * @returns StorageWrapper instance
 */
export function getScrobblerStorage<K extends keyof DataModels>(
	namespace: StorageNamespace,
): StorageWrapper<K> {
	return getLocalStorage(namespace);
}

/**
 * Return local storage wrapped into StorageWrapper object.
 * @param namespace - Scrobbler storage namespace
 * @returns StorageWrapper instance
 */
export function getLocalStorage<K extends keyof DataModels>(
	namespace: StorageNamespace,
): StorageWrapper<K> {
	const storageArea = browser.storage.local;
	return new StorageWrapper(storageArea, namespace);
}

/**
 * Return sync storage wrapped into StorageWrapper object.
 * Local storage is used as fallback.
 * @param namespace - Scrobbler storage namespace
 * @returns StorageWrapper instance
 */
export function getSyncStorage<K extends keyof DataModels>(
	namespace: StorageNamespace,
): StorageWrapper<K> {
	const storageArea = browser.storage.sync || browser.storage.local;
	return new StorageWrapper(storageArea, namespace);
}
