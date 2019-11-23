'use strict';

/**
 * Module that contains all migrate code.
 */

define((require) => {
	const Options = require('storage/options');
	const Util = require('util/util');
	const connectors = require('connectors');

	/**
	 * Perform a migration.
	 */
	async function migrate() {
		await migrateConnectorOptions();
		await migrateGooglePlayPodcastOption();
	}

	async function migrateConnectorOptions() {
		const disabledConnectors =
			await Options.getOption(Options.DISABLED_CONNECTORS);

		if (!Array.isArray(disabledConnectors)) {
			return;
		}

		if (disabledConnectors.length === 0) {
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

		await Options.setOption(
			Options.DISABLED_CONNECTORS, disabledConnectorsNew);

		Util.debugLog('Updated disabled connectors');
	}

	async function migrateGooglePlayPodcastOption() {
		const scrobbleGooglePodcasts = await Options.getConnectorOption('GoogleMusic', 'scrobblePodcasts');
		if (scrobbleGooglePodcasts === undefined) {
			return;
		}

		await Options.setOption(Options.SCROBBLE_PODCASTS, scrobbleGooglePodcasts);
		await Options.setConnectorOption('GoogleMusic', 'scrobblePodcasts', undefined);

		Util.debugLog('Migrated Google Play Music podcast scrobbling setting to global context');
	}

	return { migrate };
});
