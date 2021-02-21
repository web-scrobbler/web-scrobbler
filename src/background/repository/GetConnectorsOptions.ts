import { ConnectorsOptions } from '@/background/repository/connectors-options/ConnectorsOptions';

import { createConnectorsOptionsStorage } from '@/background/storage2/StorageFactory';

export function getConnectorsOptions(): ConnectorsOptions {
	return connectorsOptions;
}

const connectorsOptions = new ConnectorsOptions(
	createConnectorsOptionsStorage()
);
