import { Storage } from '../../storage2/Storage';
import { Options } from './Options';

import { defaultOptions } from './DefaultOptions';
import {
	DisabledConnectors,
	ExtensionOptionKey,
	ExtensionOptionsData,
} from './ExtensionOptionsRepositoryData';

export class ExtensionOptions implements Options {
	private storage: Storage<ExtensionOptionsData>;

	constructor(storage: Storage<ExtensionOptionsData>) {
		this.storage = storage;
	}

	async getOption<K extends ExtensionOptionKey>(
		key: K
	): Promise<ExtensionOptionsData[K]> {
		const storageData = await this.storage.get();
		if (key in storageData) {
			return storageData[key];
		}

		return defaultOptions[key];
	}

	async setOption<K extends ExtensionOptionKey>(
		key: K,
		value: ExtensionOptionsData[K]
	): Promise<void> {
		return this.storage.update({
			[key]: value,
		});
	}

	async isConnectorEnabled(connectorId: string): Promise<boolean> {
		const disabledConnectors = await this.getOption('disabledConnectors');

		return connectorId in disabledConnectors;
	}

	async setConnectorEnabled(
		connectorId: string,
		isEnabled: boolean
	): Promise<void> {
		const disabledConnectors = await this.getOption('disabledConnectors');

		if (isEnabled) {
			delete disabledConnectors[connectorId];
		} else {
			disabledConnectors[connectorId] = true;
		}

		return this.setOption('disabledConnectors', disabledConnectors);
	}

	/**
	 * Enable or disable all connectors.
	 *
	 * @param connectorIds List of connector IDs
	 * @param isEnabled True if connector is enabled; false otherwise
	 */
	async setConnectorsEnabled(
		connectorIds: string[],
		isEnabled: boolean
	): Promise<void> {
		const disabledConnectors: DisabledConnectors = {};

		if (!isEnabled) {
			for (const connectorId of connectorIds) {
				disabledConnectors[connectorId] = true;
			}
		}

		return this.setOption('disabledConnectors', disabledConnectors);
	}
}
