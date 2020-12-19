import { Storage } from '../../storage2/Storage';
import { Options } from './Options';

import { defaultExtensionOptions } from './DefaultExtensionOptions';
import {
	DisabledConnectors,
	ExtensionOptionsRepositoryData,
} from './ExtensionOptionsRepositoryData';
import {
	ExtensionOptionKey,
	ExtensionOptionsData,
} from './ExtensionOptionsData';

export class ExtensionOptions implements Options<ExtensionOptionsData> {
	private storage: Storage<ExtensionOptionsRepositoryData>;

	constructor(storage: Storage<ExtensionOptionsRepositoryData>) {
		this.storage = storage;
	}

	async getOption<K extends ExtensionOptionKey>(
		key: K
	): Promise<ExtensionOptionsData[K]> {
		const storageData = await this.storage.get();

		return storageData[key] ?? defaultExtensionOptions[key];
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
		const disabledConnectors = await this.getDisabledConnectors();
		return !(connectorId in disabledConnectors);
	}

	async setConnectorEnabled(
		connectorId: string,
		isEnabled: boolean
	): Promise<void> {
		const disabledConnectors = await this.getDisabledConnectors();

		if (isEnabled) {
			delete disabledConnectors[connectorId];
		} else {
			disabledConnectors[connectorId] = true;
		}

		return this.setDisabledConnectors(disabledConnectors);
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

		return this.setDisabledConnectors(disabledConnectors);
	}

	private async getDisabledConnectors(): Promise<DisabledConnectors> {
		const { disabledConnectors } = await this.storage.get();
		return disabledConnectors || {};
	}

	private async setDisabledConnectors(
		disabledConnectors: DisabledConnectors
	): Promise<void> {
		return this.storage.update({ disabledConnectors });
	}
}
