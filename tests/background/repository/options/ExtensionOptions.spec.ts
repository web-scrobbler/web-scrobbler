import { expect } from 'chai';

import { getTestName } from '#/helpers/util';
import { MockedStorage } from '#/mock/MockedStorage';

import { defaultExtensionOptions } from '@/background/repository/options/DefaultExtensionOptions';
import { ExtensionOptions } from '@/background/repository/options/ExtensionOptions';
import { Options } from '@/background/repository/options/Options';

import connectors from '@/connectors.json';
import { ExtensionOptionsRepositoryData } from '@/background/repository/options/ExtensionOptionsRepositoryData';
import { ExtensionOptionKey } from '@/background/repository/options/ExtensionOptionsData';

describe(getTestName(__filename), testOptions);

function testOptions() {
	const options = createOptions();
	const connectorIds = connectors.map((connector) => connector.id);
	const connectorId = connectorIds[0];

	it('should return default option values', () => {
		for (const [optionKey, optionValue] of Object.entries(
			defaultExtensionOptions
		)) {
			expect(
				options.getOption(optionKey as ExtensionOptionKey)
			).to.be.eventually.equal(optionValue);
		}
	});

	it('should set option value', () => {
		const promise = options.setOption('scrobblePercent', 100);
		return expect(promise).to.be.eventually.fulfilled;
	});

	it('should return new option value', () => {
		const promise = options.getOption('scrobblePercent');
		return expect(promise).to.be.eventually.equal(100);
	});

	it('should return true for enabled connector', () => {
		const promise = options.isConnectorEnabled(connectorId);
		return expect(promise).to.be.eventually.true;
	});

	it('should disable given connector', () => {
		const promise = options.setConnectorEnabled(connectorId, false);
		return expect(promise).to.be.eventually.fulfilled;
	});

	it('should return false for disabled connector', () => {
		const promise = options.isConnectorEnabled(connectorId);
		return expect(promise).to.be.eventually.false;
	});

	it('should set all connectors enabled', () => {
		const promise = options.setConnectorsEnabled(connectorIds, true);
		return expect(promise).to.be.eventually.fulfilled;
	});

	it('should return true for enabled connector', () => {
		const promise = options.isConnectorEnabled(connectorId);
		return expect(promise).to.be.eventually.true;
	});

	it('should set all connectors disabled', () => {
		const promise = options.setConnectorsEnabled(connectorIds, false);
		return expect(promise).to.be.eventually.fulfilled;
	});

	it('should return false for disabled connector', () => {
		const promise = options.isConnectorEnabled(connectorId);
		return expect(promise).to.be.eventually.false;
	});
}

function createOptions(): Options {
	const mockedStorage = new MockedStorage<ExtensionOptionsRepositoryData>();
	return new ExtensionOptions(mockedStorage);
}
