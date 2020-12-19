import { Storage } from '@/background/storage2/Storage';

import { CoreRepository } from './CoreRepository';
import { CoreRepositoryData } from './CoreRepositoryData';

export class CoreRepositoryImpl implements CoreRepository {
	private coreStorage: Storage<CoreRepositoryData>;

	constructor(storage: Storage<CoreRepositoryData>) {
		this.coreStorage = storage;
	}

	async getExtensionVersion(): Promise<string> {
		const { appVersion } = await this.coreStorage.get();
		return appVersion ?? null;
	}

	async setExtensionVersion(version: string): Promise<void> {
		if (!version) {
			throw new TypeError('The extension version should be not empty!');
		}

		return this.coreStorage.update({
			appVersion: version,
		});
	}
}
