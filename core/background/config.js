'use strict';
define(function() {
	/**
	 * Setup default options values.
	 * This function is called on module init.
	 */
	function setupDefaultConfigValues() {
		// use notifications by default
		if (typeof localStorage.useNotifications === 'undefined') {
			localStorage.useNotifications = 1;
		}

		// no disabled connectors by default
		if (typeof localStorage.disabledConnectors === 'undefined') {
			localStorage.disabledConnectors = JSON.stringify([]);
		}
	}

	/**
	 * Check if connector is enabled.
	 * @param  {stringify}  label Label of connector
	 * @return {Boolean} True if connector is enabled; false otherwise
	 */
	function isConnectorEnabled(label) {
		let disabledArray = JSON.parse(localStorage.disabledConnectors);
		return (disabledArray.indexOf(label) === -1);
	}

	setupDefaultConfigValues();

	return {
		isConnectorEnabled
	};
});
