'use strict';

/**
 * Module that contains all migrate code.
 */

define((require) => {
	const BrowserStorage = require('storage/browser-storage');
	const Options = require('storage/options');
	const Util = require('util/util');
	const connectors = require('connectors');

	/**
	 * Perform a migration.
	 */
	async function migrate() {
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

		Util.debugLog('Updated disabled connectors');
	}

	async function migrateGooglePlayPodcastOption() {
		const optionsStorage = BrowserStorage.getStorage(BrowserStorage.CONNECTORS_OPTIONS);
		const optionsData = await optionsStorage.get();

		if (optionsData.GoogleMusic !== undefined) {
			const scrobblePodcasts = optionsData.GoogleMusic.scrobblePodcasts;
			Options.setOption(Options.SCROBBLE_PODCASTS, scrobblePodcasts);

			delete optionsData['GoogleMusic'];
			await optionsStorage.set(optionsData);

			Util.debugLog('Migrated Google Play Music podcast scrobbling setting to global context');
		}
	}

	return { migrate };
});
