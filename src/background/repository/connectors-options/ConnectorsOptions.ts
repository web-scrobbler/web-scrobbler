import { defaultConnectorsOptions } from '@/background/repository/connectors-options/DefaultConnectorsOptions';

import type { ConnectorsOptionsData } from '@/background/repository/connectors-options/ConnectorsOptionsData';
import type { Storage } from '@/background/storage2/Storage';

export class ConnectorsOptions {
	constructor(private storage: Storage<ConnectorsOptionsData>) {}

	/**
	 * Return option value for a connector with the given connector ID.
	 *
	 * @param connectorId Connector ID
	 * @param optionKey Option key
	 *
	 * @return Option value
	 */
	async getOption<
		I extends keyof ConnectorsOptionsData,
		K extends keyof ConnectorsOptionsData[I]
	>(connectorId: I, optionKey: K): Promise<ConnectorsOptionsData[I][K]> {
		const storageData = await this.storage.get();

		return (
			storageData[connectorId]?.[optionKey] ??
			defaultConnectorsOptions[connectorId][optionKey]
		);
	}

	/**
	 * Set option value for a connector with the given connector ID.
	 *
	 * @param connectorId Connector ID
	 * @param optionKey Option key
	 * @param optionValue Option value
	 */
	async setOption<
		I extends keyof ConnectorsOptionsData,
		K extends keyof ConnectorsOptionsData[I],
		V extends ConnectorsOptionsData[I][K]
	>(connectorId: I, optionKey: K, optionValue: V): Promise<void> {
		const storageData = await this.storage.get();
		const connectorOptions =
			storageData[connectorId] ?? ({} as ConnectorsOptionsData[I]);

		connectorOptions[optionKey] = optionValue;
		return this.storage.update({
			[connectorId]: connectorOptions,
		});
	}
}
