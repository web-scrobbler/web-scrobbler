import BrowserStorage from '@/background/storage/browser-storage';
import Options from '@/background/storage/options';
import { debugLog } from '@/background/util/util';

import connectors from '@/connectors.json';

/**
 * Perform a migration.
 */
export async function migrate() {
	migrateConnectorOptions();
	await migrateGooglePlayPodcastOption();
}

function migrateConnectorOptions() {
	const disabledConnectors = Options.getOption(Options.DISABLED_CONNECTORS);

	if (!Array.isArray(disabledConnectors)) {
		return;
	}

	const disabledConnectorsNew = {};

	for (const label of disabledConnectors) {
		for (const connector of connectors) {
			if (connector.label === label) {
				disabledConnectorsNew[connector.id] = true;
			}
		}
	}

	Options.setOption(Options.DISABLED_CONNECTORS, disabledConnectorsNew);

	debugLog('Updated disabled connectors');
}

async function migrateGooglePlayPodcastOption() {
	const optionsStorage = BrowserStorage.getStorage(
		BrowserStorage.CONNECTORS_OPTIONS
	);
	const optionsData = await optionsStorage.get();

	if (optionsData.GoogleMusic !== undefined) {
		const scrobblePodcasts = optionsData.GoogleMusic.scrobblePodcasts;
		Options.setOption(Options.SCROBBLE_PODCASTS, scrobblePodcasts);

		delete optionsData['GoogleMusic'];
		await optionsStorage.set(optionsData);

		debugLog(
			'Migrated Google Play Music podcast scrobbling setting to global context'
		);
	}
}
