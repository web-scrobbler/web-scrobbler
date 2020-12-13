import { Storage } from './Storage';

import {
	createNamespaceStorage,
	StorageNamespace,
} from './namespace/CreateNamespaceStorage';
import { getStorageLogger as getStorageDumper } from './dumper/GetStorageLogger';

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
