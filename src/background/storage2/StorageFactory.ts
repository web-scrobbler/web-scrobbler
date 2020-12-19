import { Storage } from '@/background/storage2/Storage';

import { getStorageDumper } from '@/background/storage2/dumper/StorageDumperFactory';
import {
	createLocalStorage,
	createSyncStorage,
} from '@/background/storage2/namespace/NamespaceStorageFactory';

/* Local */

export function createCoreStorage<D>(): Storage<D> {
	return withLog<D>(createLocalStorage, 'Core');
}

export function createEditedTracksStorage<D>(): Storage<D> {
	return withLog<D>(createLocalStorage, 'LocalCache');
}

export function createNotificationsStorage<D>(): Storage<D> {
	return withLog<D>(createLocalStorage, 'Notifications');
}

/* Sync */

export function createCustomUrlPatternsStorage<D>(): Storage<D> {
	return withLog<D>(createSyncStorage, 'customPatterns');
}

export function createOptionsStorage<D>(): Storage<D> {
	return withLog<D>(createSyncStorage, 'Options');
}

/* Internal */

type NamespaceStorageCreator = <D>(namespace: string) => Storage<D>;

function withLog<D>(
	creator: NamespaceStorageCreator,
	namespace: string,
	sensitiveProperties?: string[]
): Storage<D> {
	const storage = creator<D>(namespace);
	const storageDumper = getStorageDumper();

	storageDumper
		.getStorageRawData(storage, sensitiveProperties)
		.then((storageRepresentation) => {
			console.info(`${namespace}Storage = ${storageRepresentation}`);
		});

	return storage;
}
