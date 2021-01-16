import { expect } from 'chai';

import { getTestName } from '#/helpers/util';
import { MockedStorage } from '#/mock/MockedStorage';

import { CoreRepository } from '@/background/repository/core/CoreRepository';
import { CoreRepositoryImpl } from '@/background/repository/core/CoreRepositoryImpl';

describe(getTestName(__filename), testCoreRepository);

// FIXME use `return`

function testCoreRepository() {
	const repository = createCoreRepository();
	const newVersion = '3.0.0';

	it('should have no version when initialized', async () => {
		const version = await repository.getExtensionVersion();
		expect(version).to.be.null;
	});

	it('should set new version', async () => {
		await repository.setExtensionVersion(newVersion);

		const actualVersion = await repository.getExtensionVersion();
		expect(actualVersion).to.be.equal(newVersion);
	});

	it('should not allow to set empty version', () => {
		const promise = repository.setExtensionVersion('');
		expect(promise).to.be.eventually.rejected;
	});

	it('should not allow to set null version', () => {
		const promise = repository.setExtensionVersion(null);
		expect(promise).to.be.eventually.rejected;
	});

	it('should not allow to set undefined version', () => {
		const promise = repository.setExtensionVersion(undefined);
		expect(promise).to.be.eventually.rejected;
	});
}

function createCoreRepository(): CoreRepository {
	return new CoreRepositoryImpl(new MockedStorage());
}
