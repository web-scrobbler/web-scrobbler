import { Storage } from '@/background/storage2/Storage';

import { CoreRepository } from './CoreRepository';
import { CoreRepositoryData } from './CoreRepositoryData';

export class CoreRepositoryImpl implements CoreRepository {
	private coreStorage: Storage<CoreRepositoryData>;

	constructor(storage: Storage<CoreRepositoryData>) {
		this.coreStorage = storage;
	}

	async getExtensionVersion(): Promise<string> {
		const coreStorageData = await this.coreStorage.get();
		return coreStorageData.appVersion;
	}

	async setExtensionVersion(version: string): Promise<void> {
		return this.coreStorage.update({
			appVersion: version,
		});
	}
}
