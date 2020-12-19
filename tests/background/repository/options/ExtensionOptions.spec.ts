import { expect } from 'chai';

import { getObjectKeys, getTestName } from '#/helpers/util';
import { MockedStorage } from '#/mock/MockedStorage';

import { defaultExtensionOptions } from '@/background/repository/options/DefaultExtensionOptions';
import { ExtensionOptions } from '@/background/repository/options/ExtensionOptions';
import { Options } from '@/background/repository/options/Options';

import connectors from '@/connectors.json';
import { ExtensionOptionsRepositoryData } from '@/background/repository/options/ExtensionOptionsRepositoryData';
import { ExtensionOptionsData } from '@/background/repository/options/ExtensionOptionsData';

describe(getTestName(__filename), testOptions);

function testOptions() {
	const options = createOptions();
	const connectorIds = connectors.map((connector) => connector.id);
	const connectorId = connectorIds[0];

	it('should return default option values', async () => {
		const optionKeys = getObjectKeys(defaultExtensionOptions);

		for (const optionKey of optionKeys) {
			const expectedValue = defaultExtensionOptions[optionKey];
			const actualValue = await options.getOption(optionKey);

			expect(actualValue).to.be.equal(expectedValue);
		}
	});

	it('should set option value', async () => {
		const expectedValue = 100;
		await options.setOption('scrobblePercent', expectedValue);

		const actualValue = await options.getOption('scrobblePercent');
		return expect(actualValue).to.be.equal(expectedValue);
	});

	it('should return true for enabled connector', async () => {
		const isEnabled = await options.isConnectorEnabled(connectorId);
		return expect(isEnabled).to.be.true;
	});

	it('should disable given connector', async () => {
		await options.setConnectorEnabled(connectorId, false);

		const isEnabled = await options.isConnectorEnabled(connectorId);
		return expect(isEnabled).to.be.false;
	});

	it('should enable given connector', async () => {
		await options.setConnectorEnabled(connectorId, true);

		const isEnabled = await options.isConnectorEnabled(connectorId);
		return expect(isEnabled).to.be.true;
	});

	it('should set all connectors enabled', async () => {
		await options.setConnectorsEnabled(connectorIds, true);

		const isEnabled = await options.isConnectorEnabled(connectorId);
		return expect(isEnabled).to.be.true;
	});

	it('should set all connectors disabled', async () => {
		await options.setConnectorsEnabled(connectorIds, false);

		const isEnabled = await options.isConnectorEnabled(connectorId);
		return expect(isEnabled).to.be.false;
	});
}

function createOptions(): Options<ExtensionOptionsData> {
	const mockedStorage = new MockedStorage<ExtensionOptionsRepositoryData>();
	return new ExtensionOptions(mockedStorage);
}
