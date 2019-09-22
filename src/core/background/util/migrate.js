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
		const disabledConnectorsNew = [];

		for (const label of disabledConnectors) {
			for (const connector of connectors) {
				if (connector.label === label) {
					disabledConnectorsNew.push(connector.id);
				}
			}
		}

		if (disabledConnectorsNew.length > 0) {
			Util.debugLog('Update disabled connectors');

			await Options.setOption(
				Options.DISABLED_CONNECTORS, disabledConnectorsNew);
		}
	}

	return { migrate };
});
