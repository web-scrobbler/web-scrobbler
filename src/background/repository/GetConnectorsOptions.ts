/* eslint-disable indent */

import { ConnectorsOptions } from '@/background/repository/connectors-options/ConnectorsOptions';
import { ConnectorsOptionsData } from '@/background/repository/connectors-options/ConnectorsOptionsData';
import { ConnectorsOptionsImpl } from '@/background/repository/connectors-options/ConnectorsOptionsImpl';

import { createConnectorsOptionsStorage } from '@/background/storage2/StorageFactory';

export function getConnectorsOptions(): ConnectorsOptions<
	ConnectorsOptionsData
> {
	return connectorsOptions;
}

const connectorsOptions = new ConnectorsOptionsImpl(
	createConnectorsOptionsStorage()
);
