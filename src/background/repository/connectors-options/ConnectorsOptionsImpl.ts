/* eslint-disable indent */

import { ConnectorsOptions } from '@/background/repository/connectors-options/ConnectorsOptions';
import { ConnectorsOptionsData } from '@/background/repository/connectors-options/ConnectorsOptionsData';
import { defaultConnectorsOptions } from '@/background/repository/connectors-options/DefaultConnectorsOptions';

import { Storage } from '@/background/storage2/Storage';

export class ConnectorsOptionsImpl
	implements ConnectorsOptions<ConnectorsOptionsData> {
	constructor(private storage: Storage<ConnectorsOptionsData>) {}

	async getOption<
		I extends 'youtube' | 'tidal',
		K extends keyof ConnectorsOptionsData[I]
	>(connectorId: I, optionKey: K): Promise<ConnectorsOptionsData[I][K]> {
		const storageData = await this.storage.get();
		if (
			connectorId in storageData &&
			optionKey in storageData[connectorId]
		) {
			return storageData[connectorId][optionKey];
		}

		return defaultConnectorsOptions[connectorId][optionKey];
	}

	async setOption<
		I extends 'youtube' | 'tidal',
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
