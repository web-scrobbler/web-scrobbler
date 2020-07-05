import BrowserStorage from '@/background/storage/browser-storage';

import connectors from '@/connectors.json';

const optionsStorage = BrowserStorage.getStorage(BrowserStorage.OPTIONS);
const connectorsOptionsStorage = BrowserStorage.getStorage(
	BrowserStorage.CONNECTORS_OPTIONS
);

let options = {};
let connectorsOptions = {};

const FORCE_RECOGNIZE = 'forceRecognize';
const USE_NOTIFICATIONS = 'useNotifications';
const SCROBBLE_PERCENT = 'scrobblePercent';
const DISABLED_CONNECTORS = 'disabledConnectors';
const USE_UNRECOGNIZED_SONG_NOTIFICATIONS = 'useUnrecognizedSongNotifications';
const SCROBBLE_PODCASTS = 'scrobblePodcasts';

/**
 * Object that stores default option values.
 */
const DEFAULT_OPTIONS = {
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
	 * Use now playing notifications.
	 * @type {Boolean}
	 */
	[USE_NOTIFICATIONS]: true,

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

	/**
	 * Notify if song is not recognized.
	 * @type {Boolean}
	 */
	[USE_UNRECOGNIZED_SONG_NOTIFICATIONS]: false,
};

/**
 * Object that stores default option values for specific connectors.
 */
const DEFAULT_CONNECTOR_OPTIONS = {
	Tidal: {
		useShortTrackNames: false,
	},
	YouTube: {
		scrobbleMusicOnly: false,
		scrobbleEntertainmentOnly: false,
	},
};

/**
 * Initialize module.
 */
async function initialize() {
	await setupDefaultConfigValues();
	await cleanupConfigValues();
}

/**
 * Setup default options values.
 * This function is called on module init.
 */
async function setupDefaultConfigValues() {
	options = await optionsStorage.get();
	for (const key in DEFAULT_OPTIONS) {
		if (options[key] === undefined) {
			options[key] = DEFAULT_OPTIONS[key];
		}
	}
	await optionsStorage.set(options);
	optionsStorage.debugLog([DISABLED_CONNECTORS]);

	connectorsOptions = await connectorsOptionsStorage.get();
	for (const connectorKey in DEFAULT_CONNECTOR_OPTIONS) {
		if (connectorsOptions[connectorKey] === undefined) {
			connectorsOptions[connectorKey] =
				DEFAULT_CONNECTOR_OPTIONS[connectorKey];
		} else {
			for (const key in DEFAULT_CONNECTOR_OPTIONS[connectorKey]) {
				if (connectorsOptions[connectorKey][key] === undefined) {
					connectorsOptions[connectorKey][key] =
						DEFAULT_CONNECTOR_OPTIONS[connectorKey][key];
				}
			}
		}
	}
	await connectorsOptionsStorage.set(connectorsOptions);
	connectorsOptionsStorage.debugLog();
}

async function cleanupConfigValues() {
	const data = await optionsStorage.get();

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

function getOption(key) {
	assertValidOptionKey(key);

	return options[key];
}

function setOption(key, value) {
	assertValidOptionKey(key);

	options[key] = value;
	optionsStorage.set(options);
}

function getConnectorOption(connector, key) {
	assertValidConnectorOptionKey(connector, key);

	return connectorsOptions[connector][key];
}

async function setConnectorOption(connector, key, value) {
	assertValidConnectorOptionKey(connector, key);

	connectorsOptions[connector][key] = value;
	await connectorsOptionsStorage.set(connectorsOptions);
}

/**
 * Check if connector is enabled.
 *
 * @param {Object} connector Connector
 *
 * @return {Boolean} Check result
 */
function isConnectorEnabled(connector) {
	return !options[DISABLED_CONNECTORS][connector.id] === true;
}

/**
 * Enable or disable connector.
 *
 * @param {Object} connector Connector
 * @param {Boolean} state True if connector is enabled; false otherwise
 */
function setConnectorEnabled(connector, state) {
	if (state) {
		delete options[DISABLED_CONNECTORS][connector.id];
	} else {
		options[DISABLED_CONNECTORS][connector.id] = true;
	}

	optionsStorage.set(options);
}

/**
 * Enable or disable all connectors.
 *
 * @param {Boolean} state True if connector is enabled; false otherwise
 */
function setAllConnectorsEnabled(state) {
	options[DISABLED_CONNECTORS] = {};
	if (!state) {
		for (const connector of connectors) {
			options[DISABLED_CONNECTORS][connector.id] = true;
		}
	}

	optionsStorage.set(options);
}

/**
 * Return a list of connectors IDs have custom settings.
 *
 * @return {Array} List of connectors labels
 */
function getConnectorsList() {
	return Object.keys(DEFAULT_CONNECTOR_OPTIONS);
}

/**
 * Return a list of options for a given connector label.
 *
 * @param {String} connectorLabel Connector label
 *
 * @return {Array} List of option keys
 */
function getConnectorOptions(connectorLabel) {
	return Object.keys(DEFAULT_CONNECTOR_OPTIONS[connectorLabel]);
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

initialize();

export default {
	isConnectorEnabled,
	setConnectorEnabled,
	setAllConnectorsEnabled,

	getOption,
	setOption,
	getConnectorOption,
	setConnectorOption,

	getConnectorsList,
	getConnectorOptions,

	FORCE_RECOGNIZE,
	USE_NOTIFICATIONS,
	SCROBBLE_PODCASTS,
	USE_UNRECOGNIZED_SONG_NOTIFICATIONS,
	DISABLED_CONNECTORS,
	SCROBBLE_PERCENT,
};
