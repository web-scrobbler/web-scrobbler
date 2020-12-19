import { expect } from 'chai';

import { getTestName } from '#/helpers/util';
import { MockedStorage } from '#/mock/MockedStorage';

import { CustomUrlPatterns } from '@/background/repository/custom-patterns/CustomUrlPatterns';
import { CustomUrlPatternsImpl } from '@/background/repository/custom-patterns/CustomUrlPatternsImpl';

describe(getTestName(__filename), testCustomUrlPatternsRepository);

function testCustomUrlPatternsRepository() {
	const repository = createCustomUrlPatterns();

	const connectorId = 'dummyConnectorId';
	const customUrlPatterns = ['pattern1', 'pattern2'];

	it('should have no patterns for unknown connector', async () => {
		const patterns = await repository.getPatterns(connectorId);
		expect(patterns).to.be.empty;
	});

	it('should add patterns to unknown connector', async () => {
		await repository.setPatterns(connectorId, customUrlPatterns);

		const patterns = await repository.getPatterns(connectorId);
		expect(patterns).to.be.deep.equal(customUrlPatterns);
	});

	it('should remove patterns for known connector', async () => {
		await repository.deletePatterns(connectorId);

		const patterns = await repository.getPatterns(connectorId);
		expect(patterns).to.be.empty;
	});

	it('should remove patterns for unknown connector', async () => {
		await repository.deletePatterns(connectorId);

		const patterns = await repository.getPatterns(connectorId);
		expect(patterns).to.be.empty;
	});
}

function createCustomUrlPatterns(): CustomUrlPatterns {
	return new CustomUrlPatternsImpl(new MockedStorage());
}
