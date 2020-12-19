import { expect } from 'chai';

import { getTestName } from '#/helpers/util';
import { MockedStorage } from '#/mock/MockedStorage';

import { CustomUrlPatterns } from '@/background/repository/custom-patterns/CustomUrlPatterns';
import { CustomUrlPatternsData } from '@/background/repository/custom-patterns/CustomUrlPatternsData';
import { CustomUrlPatternsImpl } from '@/background/repository/custom-patterns/CustomUrlPatternsImpl';

describe(getTestName(__filename), () => {
	describe(
		'test custom URL patterns repository',
		testCustomUrlPatternsRepository
	);
});

function testCustomUrlPatternsRepository() {
	const repository = createMockedRepository();
	const connectorId = 'dummyConnectorId';
	const customUrlPatterns = ['pattern1', 'pattern2'];

	it('should have no patterns for unknown connector', () => {
		const promise = repository.getPatterns(connectorId);
		return expect(promise).to.be.eventually.empty;
	});

	it('should add patterns to unknown connector', () => {
		const promise = repository.setPatterns(connectorId, customUrlPatterns);
		return expect(promise).to.be.eventually.fulfilled;
	});

	it('should have patterns for known connector', () => {
		const promise = repository.getPatterns(connectorId);
		return expect(promise).to.be.eventually.deep.equal(customUrlPatterns);
	});

	it('should remove patterns for known connector', () => {
		const promise = repository.deletePatterns(connectorId);
		return expect(promise).to.be.eventually.fulfilled;
	});

	it('should remove patterns for unknown connector', () => {
		const promise = repository.deletePatterns(connectorId);
		return expect(promise).to.be.eventually.fulfilled;
	});

	it('should have no patterns for removed connector', () => {
		const promise = repository.getPatterns(connectorId);
		return expect(promise).to.be.eventually.empty;
	});
}

function createMockedRepository(): CustomUrlPatterns {
	const mockedStorage = new MockedStorage<CustomUrlPatternsData>();
	return new CustomUrlPatternsImpl(mockedStorage);
}
