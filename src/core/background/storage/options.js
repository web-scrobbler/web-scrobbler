'use strict';

define((require) => {
	const connectors = require('connectors');
	const BrowserStorage = require('storage/browser-storage');

	const options = BrowserStorage.getStorage(BrowserStorage.OPTIONS);
	const connectorsOptions = BrowserStorage.getStorage(BrowserStorage.CONNECTORS_OPTIONS);
	const connectorsOverrideOptions = BrowserStorage.getStorage(BrowserStorage.CONNECTORS_OVERRIDE_OPTIONS);

	const USE_NOTIFICATIONS = 'useNotifications';
	const USE_UNRECOGNIZED_SONG_NOTIFICATIONS = 'useUnrecognizedSongNotifications';
	const SCROBBLE_PODCASTS = 'scrobblePodcasts';
	const FORCE_RECOGNIZE = 'forceRecognize';
	const SCROBBLE_RECOGNIZED_TRACKS = 'scrobbleRecognizedTracks';
	const SCROBBLE_EDITED_TRACKS_ONLY = 'scrobbleEditedTracksOnly';
	const SCROBBLE_PERCENT = 'scrobblePercent';
	const DISABLED_CONNECTORS = 'disabledConnectors';

	/**
	 * Object that stores default option values.
	 * @type {Object}
	 */
	const DEFAULT_OPTIONS = {
		/**
		 * Use now playing notifications.
		 * @type {Boolean}
		 */
		[USE_NOTIFICATIONS]: true,

		/**
		 * Notify if song is not recognized.
		 * @type {Boolean}
		 */
		[USE_UNRECOGNIZED_SONG_NOTIFICATIONS]: false,

		/**
		 * Force song recognition.
		 * @type {Boolean}
		 */
		[FORCE_RECOGNIZE]: false,

		/**
		 * Scrobble podcast episodes.
		 * @type {Boolean}
		 */
		[SCROBBLE_PODCASTS]: true,

		/**
		 * Only scrobble tracks if they are recognized or edited.
		 * @type {Boolean}
		 */
		[SCROBBLE_RECOGNIZED_TRACKS]: true,

		/**
		 * Only scrobble tracks if they are edited.
		 * @type {Boolean}
		 */
		[SCROBBLE_EDITED_TRACKS_ONLY]: false,

		/**
		 * Scrobble percent.
		 * @type {Number}
		 */
		[SCROBBLE_PERCENT]: 50,

		/**
		 * Object contains info of disabled connectors.
		 * Each key is a connector ID. If the connector is disabled,
		 * key value should be true. If connector is enabled, key should not exist.
		 * @type {Object}
		 */
		[DISABLED_CONNECTORS]: {},
	};

	/**
	 * Object that stores default option values for specific connectors.
	 * @type {Object}
	 */
	const DEFAULT_CONNECTOR_OPTIONS = {
		YouTube: {
			scrobbleMusicOnly: false,
			scrobbleEntertainmentOnly: false,
		},
	};

	/**
	 * Setup default options values.
	 * This function is called on module init.
	 */
	async function setupDefaultConfigValues() {
		let data = await options.get();
		for (const key in DEFAULT_OPTIONS) {
			if (data[key] === undefined) {
				data[key] = DEFAULT_OPTIONS[key];
			}
		}
		await options.set(data);
		options.debugLog([DISABLED_CONNECTORS]);

		data = await connectorsOptions.get();
		for (const connectorKey in DEFAULT_CONNECTOR_OPTIONS) {
			if (data[connectorKey] === undefined) {
				data[connectorKey] = DEFAULT_CONNECTOR_OPTIONS[connectorKey];
			} else {
				for (const key in DEFAULT_CONNECTOR_OPTIONS[connectorKey]) {
					if (data[connectorKey][key] === undefined) {
						data[connectorKey][key] = DEFAULT_CONNECTOR_OPTIONS[connectorKey][key];
					}
				}
			}
		}
		await connectorsOptions.set(data);
		connectorsOptions.debugLog();

		connectorsOverrideOptions.debugLog();
	}

	async function cleanupConfigValues() {
		const data = await options.get();

		for (const connectorId of Object.keys(data[DISABLED_CONNECTORS])) {
			let isFound = false;

			for (const connector of connectors) {
				if (connector.id === connectorId) {
					isFound = true;
					break;
				}
			}

			if (!isFound) {
				delete data[DISABLED_CONNECTORS][connectorId];
				console.log(`Remove ${connectorId} from storage`);
			}
		}
	}

	async function getOption(key, connector) {
		assertValidOptionKey(key);

		if (connector !== undefined) {
			const optionValue = await getConnectorOverrideOption(connector, key);
			if (optionValue !== undefined) {
				return optionValue;
			}
		}

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

	async function getConnectorOverrideOption(connector, key) {
		const data = await connectorsOverrideOptions.get();
		return data[connector] && data[connector][key];
	}

	async function setConnectorOverrideOption(connector, key, value) {
		const data = await connectorsOverrideOptions.get();
		if (!data[connector]) {
			data[connector] = {};
		}
		data[connector][key] = value;

		await connectorsOverrideOptions.set(data);
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
	 * @param  {Object} connector Connector
	 * @return {Boolean} Check result
	 */
	async function isConnectorEnabled(connector) {
		const data = await options.get();
		return !data[DISABLED_CONNECTORS][connector.id] === true;
	}

	/**
	 * Enable or disable connector.
	 * @param  {Object}  connector Connector
	 * @param  {Boolean} state True if connector is enabled; false otherwise
	 */
	async function setConnectorEnabled(connector, state) {
		const data = await options.get();

		if (state) {
			delete data[DISABLED_CONNECTORS][connector.id];
		} else {
			data[DISABLED_CONNECTORS][connector.id] = true;
		}

		await options.set(data);
	}

	/**
	 * Enable or disable all connectors.
	 * @param  {Boolean} state True if connector is enabled; false otherwise
	 */
	async function setAllConnectorsEnabled(state) {
		const data = await options.get();

		data[DISABLED_CONNECTORS] = {};
		if (!state) {
			for (const connector of connectors) {
				data[DISABLED_CONNECTORS][connector.id] = true;
			}
		}

		await options.set(data);
	}

	setupDefaultConfigValues().then(cleanupConfigValues);

	return {
		isConnectorEnabled, setConnectorEnabled, setAllConnectorsEnabled,

		getOption, setOption, getConnectorOption, setConnectorOption,
		getConnectorOverrideOption, setConnectorOverrideOption,

		USE_NOTIFICATIONS, USE_UNRECOGNIZED_SONG_NOTIFICATIONS, SCROBBLE_PODCASTS,
		FORCE_RECOGNIZE, SCROBBLE_RECOGNIZED_TRACKS, SCROBBLE_EDITED_TRACKS_ONLY,
		SCROBBLE_PERCENT, DISABLED_CONNECTORS,
	};
});
