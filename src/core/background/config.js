'use strict';

define((require) => {
	const connectors = require('connectors');
	const ChromeStorage = require('storage/chrome-storage');

	const options = ChromeStorage.getStorage(ChromeStorage.OPTIONS);
	const connectorsOptions = ChromeStorage.getStorage(ChromeStorage.CONNECTORS_OPTIONS);

	/**
	 * Object that stores default option values.
	 * @type {Object}
	 */
	const defaultOptionsMap = {
		/**
		 * Array of disabled connectors.
		 * @type {Array}
		 */
		disabledConnectors: [],
		/**
		 * Disable Google Analytics.
		 * @type {Boolean}
		 */
		disableGa: false,
		/**
		 * Force song recognition.
		 * @type {Boolean}
		 */
		forceRecognize: false,
		/**
		 * Use now playing notifications.
		 * @type {Boolean}
		 */
		useNotifications: true,
		/**
		 * Notify if song is not recognized.
		 * @type {Boolean}
		 */
		useUnrecognizedSongNotifications: false,
	};

	/**
	 * Object that stores default option values for specific connectors.
	 * @type {Object}
	 */
	const defaultConnectorsOptionsMap = {
		GoogleMusic: {
			scrobblePodcasts: true
		},
		YouTube: {
			scrobbleMusicOnly: false,
			scrobbleEntertainmentOnly: false
		}
	};

	/**
	 * Setup default options values.
	 * This function is called on module init.
	 */
	function setupDefaultConfigValues() {
		options.get().then((data) => {
			for (let key in defaultOptionsMap) {
				if (data[key] === undefined) {
					data[key] = defaultOptionsMap[key];
				}
			}
			options.set(data).then(() => {
				options.debugLog();
			});
		});
		connectorsOptions.get().then((data) => {
			for (let connectorKey in defaultConnectorsOptionsMap) {
				if (data[connectorKey] === undefined) {
					data[connectorKey] = defaultConnectorsOptionsMap[connectorKey];
				} else {
					for (let key in defaultConnectorsOptionsMap[connectorKey]) {
						if (data[connectorKey][key] === undefined) {
							data[connectorKey][key] = defaultConnectorsOptionsMap[connectorKey][key];
						}
					}
				}
			}
			connectorsOptions.set(data).then(() => {
				connectorsOptions.debugLog();
			});
		});
	}

	/**
	 * Check if connector is enabled.
	 * @param  {String}  label Connector label
	 * @return {Promise} Promise that will be resolved with result value
	 */
	function isConnectorEnabled(label) {
		return options.get().then((data) => {
			return !data.disabledConnectors.includes(label);
		});
	}

	/**
	 * Enable or disable connector.
	 * @param  {String}  label Connector label
	 * @param  {Boolean} state True if connector is enabled; false otherwise
	 */
	function setConnectorEnabled(label, state) {
		options.get().then((data) => {
			let index = data.disabledConnectors.indexOf(label);
			if (index === -1 && !state) {
				data.disabledConnectors.push(label);
			} else if (state) {
				data.disabledConnectors.splice(index, 1);
			}

			options.set(data);
		});
	}

	/**
	 * Enable or disable all connectors.
	 * @param  {Boolean} state True if connector is enabled; false otherwise
	 */
	function setAllConnectorsEnabled(state) {
		options.get().then((data) => {
			data.disabledConnectors = [];
			if (!state) {
				for (let connector of connectors) {
					data.disabledConnectors.push(connector.label);
				}
			}

			options.set(data);
		});
	}

	setupDefaultConfigValues();

	return {
		isConnectorEnabled, setConnectorEnabled, setAllConnectorsEnabled,
	};
});
