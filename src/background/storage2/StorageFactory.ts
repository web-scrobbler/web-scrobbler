import { Storage } from '@/background/storage2/Storage';

import { getStorageDumper } from '@/background/storage2/dumper/StorageDumperFactory';
import {
	createNamespaceStorage,
	StorageNamespace,
} from '@/background/storage2/namespace/NamespaceStorageFactory';

export function createCoreStorage<T>(): Storage<T> {
	return createStorageWithLog<T>(StorageNamespace.Core);
}

export function createCustomUrlPatternsStorage<T>(): Storage<T> {
	return createStorageWithLog<T>(StorageNamespace.CustomUrlPatterns);
}

export function createEditedTracksStorage<T>(): Storage<T> {
	return createStorageWithLog<T>(StorageNamespace.EditedTracks);
}

export function createNotificationsStorage<T>(): Storage<T> {
	return createStorageWithLog<T>(StorageNamespace.Notifications);
}

export function createOptionsStorage<T>(): Storage<T> {
	return createStorageWithLog<T>(StorageNamespace.Options);
}

function createStorageWithLog<T>(
	namespace: StorageNamespace,
	sensitiveProperties?: string[]
): Storage<T> {
	const storage = createNamespaceStorage<T>(namespace);
	const storageDumper = getStorageDumper();

	storageDumper
		.getStorageRawData(storage, sensitiveProperties)
		.then((storageRepresentation) => {
			console.info(`${namespace}Storage = ${storageRepresentation}`);
		});

	return storage;
}
