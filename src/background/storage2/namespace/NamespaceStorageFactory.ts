import { browser } from 'webextension-polyfill-ts';

import { NamespaceStorage } from './NamespaceStorage';
import { Storage } from '../Storage';

type StorageCreatorFunction = <T>(namespace: string) => Storage<T>;

enum StorageType {
	Local,
	Sync,
}

export enum StorageNamespace {
	Core = 'Core',
	CustomUrlPatterns = 'customPatterns',
	EditedTracks = 'LocalCache',
	Notifications = 'Notifications',
	Options = 'Options',
}

const storageTypeMap: Record<string, StorageType> = {
	[StorageNamespace.Core]: StorageType.Local,
	[StorageNamespace.CustomUrlPatterns]: StorageType.Sync,
	[StorageNamespace.EditedTracks]: StorageType.Local,
	[StorageNamespace.Notifications]: StorageType.Local,
	[StorageNamespace.Options]: StorageType.Sync,
};

export function createNamespaceStorage<T>(
	namespace: StorageNamespace
): Storage<T> {
	if (!(namespace in storageTypeMap)) {
		throw new Error(`Unknown storage namespace: ${namespace}`);
	}

	const storageType = storageTypeMap[namespace];
	const creatorFunction = getCreatorFunction(storageType);

	return creatorFunction<T>(namespace);
}

function getCreatorFunction(storageType: StorageType): StorageCreatorFunction {
	switch (storageType) {
		case StorageType.Local:
			return createLocalStorage;

		case StorageType.Sync:
			return createSyncStorage;
	}
}

/**
 * Create a local storage wrapped into NamespacedStorage object.
 *
 * @param namespace Storage namespace
 *
 * @return StorageWrapper instance
 */
function createLocalStorage<T>(namespace: string): Storage<T> {
	return new NamespaceStorage<T>(browser.storage.local, namespace);
}

/**
 * Create a sync storage wrapped into NamespacedStorage object.
 *
 * @param namespace Storage namespace
 *
 * @return StorageWrapper instance
 */
function createSyncStorage<T>(namespace: string): Storage<T> {
	return new NamespaceStorage<T>(browser.storage.sync, namespace);
}
