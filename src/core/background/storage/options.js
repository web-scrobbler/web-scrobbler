'use strict';

define((require) => {
	const connectors = require('connectors');
	const BrowserStorage = require('storage/browser-storage');

	const options = BrowserStorage.getStorage(BrowserStorage.OPTIONS);
	const connectorsOptions = BrowserStorage.getStorage(BrowserStorage.CONNECTORS_OPTIONS);

	const DISABLE_GA = 'disableGa';
	const FORCE_RECOGNIZE = 'forceRecognize';
	const USE_NOTIFICATIONS = 'useNotifications';
	const DISABLED_CONNECTORS = 'disabledConnectors';
	const USE_UNRECOGNIZED_SONG_NOTIFICATIONS = 'useUnrecognizedSongNotifications';

	/**
	 * Object that stores default option values.
	 * @type {Object}
	 */
	const DEFAULT_OPTIONS = {};

	/**
	 * Disable Google Analytics.
	 * @type {Boolean}
	 */
	DEFAULT_OPTIONS[DISABLE_GA] = false;
	/**
	 * Force song recognition.
	 * @type {Boolean}
	 */
	DEFAULT_OPTIONS[FORCE_RECOGNIZE] = false;
	/**
	 * Array of disabled connectors.
	 * @type {Array}
	 */
	DEFAULT_OPTIONS[DISABLED_CONNECTORS] = [];
	/**
	 * Use now playing notifications.
	 * @type {Boolean}
	 */
	DEFAULT_OPTIONS[USE_NOTIFICATIONS] = true;
	/**
	 * Notify if song is not recognized.
	 * @type {Boolean}
	 */
	DEFAULT_OPTIONS[USE_UNRECOGNIZED_SONG_NOTIFICATIONS] = false;

	/**
	 * Object that stores default option values for specific connectors.
	 * @type {Object}
	 */
	const DEFAULT_CONNECTOR_OPTIONS = {
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
	async function setupDefaultConfigValues() {
		let data = await options.get();
		for (let key in DEFAULT_OPTIONS) {
			if (data[key] === undefined) {
				data[key] = DEFAULT_OPTIONS[key];
			}
		}
		await options.set(data);
		options.debugLog();

		data = await connectorsOptions.get();
		for (let connectorKey in DEFAULT_CONNECTOR_OPTIONS) {
			if (data[connectorKey] === undefined) {
				data[connectorKey] = DEFAULT_CONNECTOR_OPTIONS[connectorKey];
			} else {
				for (let key in DEFAULT_CONNECTOR_OPTIONS[connectorKey]) {
					if (data[connectorKey][key] === undefined) {
						data[connectorKey][key] = DEFAULT_CONNECTOR_OPTIONS[connectorKey][key];
					}
				}
			}
		}
		await connectorsOptions.set(data);
		connectorsOptions.debugLog();
	}

	async function getOption(key) {
		assertValidOptionKey(key);

		const data = await options.get();
		return data[key];
	}

	async function setOption(key, value) {
		assertValidOptionKey(key);

		await options.update({ [key]: value });
	}

	async function getConnectorOption(connector, key) {
		assertValidConnectorOptionKey(connector, key);

		const data = await connectorsOptions.get();
		return data[connector][key];
	}

	async function setConnectorOption(connector, key, value) {
		assertValidConnectorOptionKey(connector, key);

		const data = await connectorsOptions.get();
		data[connector][key] = value;

		await connectorsOptions.set(data);
	}

	function assertValidOptionKey(key) {
		if (!(key in DEFAULT_OPTIONS)) {
			throw new Error(`Unknown option key: ${key}`);
		}
	}

	function assertValidConnectorOptionKey(connector, key) {
		if (!(connector in DEFAULT_CONNECTOR_OPTIONS)) {
			throw new Error(`Unknown connector: ${connector}`);
		}

		if (!(key in DEFAULT_CONNECTOR_OPTIONS[connector])) {
			throw new Error(`Unknown connector option key: ${key}`);
		}
	}

	/**
	 * Check if connector is enabled.
	 * @param  {String}  label Connector label
	 * @return {Boolean} Check result
	 */
	async function isConnectorEnabled(label) {
		let data = await options.get();
		return !data.disabledConnectors.includes(label);
	}

	/**
	 * Enable or disable connector.
	 * @param  {String}  label Connector label
	 * @param  {Boolean} state True if connector is enabled; false otherwise
	 */
	async function setConnectorEnabled(label, state) {
		let data = await options.get();

		let index = data.disabledConnectors.indexOf(label);
		if (index === -1 && !state) {
			data.disabledConnectors.push(label);
		} else if (state) {
			data.disabledConnectors.splice(index, 1);
		}

		await options.set(data);
	}

	/**
	 * Enable or disable all connectors.
	 * @param  {Boolean} state True if connector is enabled; false otherwise
	 */
	async function setAllConnectorsEnabled(state) {
		let data = await options.get();

		data.disabledConnectors = [];
		if (!state) {
			for (let connector of connectors) {
				data.disabledConnectors.push(connector.label);
			}
		}

		await options.set(data);
	}

	setupDefaultConfigValues();

	return {
		isConnectorEnabled, setConnectorEnabled, setAllConnectorsEnabled,

		getOption, setOption, getConnectorOption, setConnectorOption,

		DISABLE_GA, FORCE_RECOGNIZE, USE_NOTIFICATIONS,
		USE_UNRECOGNIZED_SONG_NOTIFICATIONS, DISABLED_CONNECTORS,
	};
});
