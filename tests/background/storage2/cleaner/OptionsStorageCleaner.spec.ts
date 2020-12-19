import { expect } from 'chai';

import { getTestName } from '#/helpers/util';
import { MockedStorage } from '#/mock/MockedStorage';

import { Storage } from '@/background/storage2/Storage';

import { ExtensionOptionsRepositoryData } from '@/background/repository/options/ExtensionOptionsRepositoryData';
import { OptionsCleaner } from '@/background/storage2/cleaner/OptionsStorageCleaner';

import { defaultExtensionOptions } from '@/background/repository/options/DefaultExtensionOptions';

describe(getTestName(__filename), testOptionsStorageCleaner);

function testOptionsStorageCleaner() {
	const storage = createOptionsStorage();
	const cleaner = new OptionsCleaner();

	it('should have disabled connectors', async () => {
		const { disabledConnectors } = await storage.get();
		return expect(disabledConnectors).to.be.not.deep.equal({});
	});

	it('should clean up storage', async () => {
		await cleaner.clean(storage);

		const { disabledConnectors } = await storage.get();
		return expect(disabledConnectors).to.be.deep.equal({});
	});
}

function createOptionsStorage(): Storage<ExtensionOptionsRepositoryData> {
	const defaultStorageData = {
		...defaultExtensionOptions,
		disabledConnectors: {
			connector1: true,
			connector2: true,
		},
	};

	return new MockedStorage<ExtensionOptionsRepositoryData>(
		defaultStorageData
	);
}
