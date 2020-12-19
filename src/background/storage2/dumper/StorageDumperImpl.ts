import { Storage } from '../Storage';
import { StorageDumper } from './StorageDumper';

import { createHideSensitiveDataFunction } from './HideSensitiveData';

export class StorageDumperImpl implements StorageDumper {
	async getStorageRawData(
		storage: Storage<unknown>,
		sensitiveProperties?: string[]
	): Promise<string> {
		const storageData = await storage.get();

		const hideSensitiveDataFn = createHideSensitiveDataFunction(
			sensitiveProperties
		);
		return JSON.stringify(storageData, hideSensitiveDataFn, 2);
	}
}
