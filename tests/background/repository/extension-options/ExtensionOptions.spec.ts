import { expect } from 'chai';

import { getObjectKeys, describeModuleTest } from '#/helpers/util';
import { MemoryStorage } from '#/stub/MemoryStorage';

import { ExtensionOptions } from '@/background/repository/extension-options/ExtensionOptions';
import { defaultExtensionOptions } from '@/background/repository/extension-options/DefaultExtensionOptions';

import connectors from '@/connectors.json';

describeModuleTest(__filename, () => {
	const options = new ExtensionOptions(new MemoryStorage());
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
		expect(actualValue).to.be.equal(expectedValue);
	});

	it('should return true for enabled connector', async () => {
		const isEnabled = await options.isConnectorEnabled(connectorId);
		expect(isEnabled).to.be.true;
	});

	it('should disable given connector', async () => {
		await options.setConnectorEnabled(connectorId, false);

		const isEnabled = await options.isConnectorEnabled(connectorId);
		expect(isEnabled).to.be.false;
	});

	it('should enable given connector', async () => {
		await options.setConnectorEnabled(connectorId, true);

		const isEnabled = await options.isConnectorEnabled(connectorId);
		expect(isEnabled).to.be.true;
	});

	it('should set all connectors enabled', async () => {
		await options.setConnectorsEnabled(connectorIds, true);

		const isEnabled = await options.isConnectorEnabled(connectorId);
		expect(isEnabled).to.be.true;
	});

	it('should set all connectors disabled', async () => {
		await options.setConnectorsEnabled(connectorIds, false);

		const isEnabled = await options.isConnectorEnabled(connectorId);
		return expect(isEnabled).to.be.false;
	});
});
