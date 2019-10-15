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

	return { migrate };
});
