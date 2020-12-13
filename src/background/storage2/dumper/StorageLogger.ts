import { Storage } from '../Storage';

export interface StorageDumper {
	getStorageRawData(
		storage: Storage<unknown>,
		sensitiveProperties?: string[]
	): Promise<string>;
}
