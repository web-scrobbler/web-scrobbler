/* eslint-disable indent */

import { ExtensionOptionsRepositoryData } from '@/background/repository/options/ExtensionOptionsRepositoryData';

import { StorageCleaner } from '@/background/storage2/cleaner/StorageCleaner';
import { Storage } from '@/background/storage2/Storage';

import connectors from '@/connectors.json';

export class OptionsStorageCleaner
	implements StorageCleaner<ExtensionOptionsRepositoryData> {
	async clean(
		storage: Storage<ExtensionOptionsRepositoryData>
	): Promise<void> {
		const { disabledConnectors } = await storage.get();
		let isCleanedUp = false;

		for (const connectorId of Object.keys(disabledConnectors)) {
			const isFound = connectors.some(
				(connector) => connector.id === connectorId
			);

			if (isFound) {
				continue;
			}

			delete disabledConnectors[connectorId];
			isCleanedUp = true;
		}

		if (isCleanedUp) {
			await storage.update({ disabledConnectors });
		}
	}
}
