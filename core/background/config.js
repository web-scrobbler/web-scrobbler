'use strict';

define(function() {
	return {
		isConnectorEnabled, setConnectorEnabled
	};
});

/**
 * Object that stores default option values.
 * @type {Object}
 */
const defaultOptionsMap = {
	/**
	 * Array of disabled connectors.
	 * @type {String}
	 */
	disabledConnectors: '[]',
	/**
	 * Disable Google Analytics.
	 * @type {Number}
	 */
	disableGa: 0,
	/**
	 * Force song recognition.
	 * @type {Number}
	 */
	forceRecognize: 0,
	/**
	 * Use autocorrection when retrieving song info from Last.fm.
	 * @type {Number}
	 */
	useAutocorrect: 0,
	/**
	 * Use now playing notifications.
	 * @type {Number}
	 */
	useNotifications: 1
};

/**
 * Setup default options values.
 * This function is called on module init.
 */
function setupDefaultConfigValues() {
	for (let key in defaultOptionsMap) {
		if (typeof localStorage[key] === 'undefined') {
			localStorage[key] = defaultOptionsMap[key];
		}
	}
}

/**
 * Check if connector is enabled.
 * @param  {String}  label Label of connector
 * @return {Boolean} True if connector is enabled; false otherwise
 */
function isConnectorEnabled(label) {
	let disabledArray = JSON.parse(localStorage.disabledConnectors);
	return (disabledArray.indexOf(label) === -1);
}

/**
 * Enable or disable connector.
 * @param {String} label [description]
 * @param {Boolean} state True if connector is enabled; false otherwise
 */
function setConnectorEnabled(label, state) {
	let disabledArray = JSON.parse(localStorage.disabledConnectors);

	let index = disabledArray.indexOf(label);
	if (index === -1 && !state) {
		disabledArray.push(label);
		localStorage.disabledConnectors = JSON.stringify(disabledArray);
	} else if (state) {
		disabledArray.splice(index, 1);
		localStorage.disabledConnectors = JSON.stringify(disabledArray);
	}
}

setupDefaultConfigValues();
