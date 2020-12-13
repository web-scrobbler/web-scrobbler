import { Storage } from '../../storage2/Storage';
import { Options } from './Options';

import { defaultOptions } from './DefaultOptions';
import {
	DisabledConnectors,
	OptionKey,
	OptionsRepositoryData,
} from './ExtensionOptionsRepositoryData';

export class ExtensionOptions implements Options {
	private storage: Storage<OptionsRepositoryData>;

	constructor(storage: Storage<OptionsRepositoryData>) {
		this.storage = storage;
	}

	async getOption<T>(key: OptionKey): Promise<T> {
		const storageData = await this.storage.get();
		if (key in storageData) {
			// @ts-ignore
			return storageData[key] as T;
		}

		// @ts-ignore
		return defaultOptions[key] as T;
	}

	async setOption<T>(key: OptionKey, value: T): Promise<void> {
		return this.storage.update({
			[key]: value,
		});
	}

	async isConnectorEnabled(connectorId: string): Promise<boolean> {
		const disabledConnectors = await this.getOption<DisabledConnectors>(
			'disabledConnectors'
		);

		return connectorId in disabledConnectors;
	}

	async setConnectorEnabled(
		connectorId: string,
		isEnabled: boolean
	): Promise<void> {
		const disabledConnectors = await this.getOption<DisabledConnectors>(
			'disabledConnectors'
		);

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
