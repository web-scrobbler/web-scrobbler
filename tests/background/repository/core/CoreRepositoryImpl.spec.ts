import { getTestName } from '#/helpers/util';
import { MockedStorage } from '#/mock/MockedStorage';
import { CoreRepository } from '@/background/repository/core/CoreRepository';
import { CoreRepositoryData } from '@/background/repository/core/CoreRepositoryData';
import { CoreRepositoryImpl } from '@/background/repository/core/CoreRepositoryImpl';
import { expect } from 'chai';

describe(getTestName(__filename), testCoreRepository);

function testCoreRepository() {
	const repository = createCoreRepository();
	const newVersion = '3.0.0';

	it('should have no version when initialized', () => {
		const promise = repository.getExtensionVersion();
		return expect(promise).to.be.eventually.null;
	});

	it('should set new version', () => {
		const promise = repository.setExtensionVersion(newVersion);
		return expect(promise).to.be.eventually.fulfilled;
	});

	it('should read new version value', () => {
		const promise = repository.getExtensionVersion();
		return expect(promise).to.be.eventually.equal(newVersion);
	});

	it('should not allow to set empty version', () => {
		const promise = repository.setExtensionVersion('');
		return expect(promise).to.be.eventually.rejected;
	});

	it('should not allow to set null version', () => {
		const promise = repository.setExtensionVersion(null);
		return expect(promise).to.be.eventually.rejected;
	});

	it('should not allow to set undefined version', () => {
		const promise = repository.setExtensionVersion(undefined);
		return expect(promise).to.be.eventually.rejected;
	});
}

function createCoreRepository(): CoreRepository {
	return new CoreRepositoryImpl(new MockedStorage<CoreRepositoryData>());
}
