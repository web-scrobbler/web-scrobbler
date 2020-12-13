import { StorageDumper } from './StorageLogger';
import { StorageDumperImpl } from './StorageLoggerImpl';

export function getStorageLogger(): StorageDumper {
	return storageDumper;
}

const storageDumper = new StorageDumperImpl();
