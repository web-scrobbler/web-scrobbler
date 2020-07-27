import BrowserStorage from '@/background/storage/browser-storage';

import connectors from '@/connectors.json';
import { ConnectorEntry } from '@/common/connector-entry';

const optionsStorage = BrowserStorage.getStorage(BrowserStorage.OPTIONS);
const connectorsOptionsStorage = BrowserStorage.getStorage(
	BrowserStorage.CONNECTORS_OPTIONS
);

const FORCE_RECOGNIZE = 'forceRecognize';
const USE_NOTIFICATIONS = 'useNotifications';
const SCROBBLE_PERCENT = 'scrobblePercent';
const DISABLED_CONNECTORS = 'disabledConnectors';
const USE_UNRECOGNIZED_SONG_NOTIFICATIONS = 'useUnrecognizedSongNotifications';
const SCROBBLE_PODCASTS = 'scrobblePodcasts';

interface Options {
	/**
	 * Object contains info of disabled connectors.
	 * Each key is a connector ID. If the connector is disabled,
	 * key value should be true. If connector is enabled, key should not exist.
	 * @type {Object}
	 */
	disabledConnectors: Record<string, boolean>;
	/**
	 * Force song recognition.
	 */
	forceRecognize: boolean;
	/**
	 * Scrobble percent.
	 * @type {Number}
	 */
	scrobblePercent: number;
	/**
	 * Scrobble podcast episodes.
	 */
	scrobblePodcasts: boolean;
	/**
	 * Use now playing notifications.
	 */
	useNotifications: boolean;
	/**
	 * Notify if song is not recognized.
	 */
	useUnrecognizedSongNotifications: boolean;
}

interface ConnectorOptions {
	Tidal: {
		useShortTrackNames: boolean;
	};
	YouTube: {
		scrobbleMusicOnly: boolean;
		scrobbleEntertainmentOnly: boolean;
	};
}

/**
 * Object that stores default option values.
 */
const defaultOptions: Options = {
	[FORCE_RECOGNIZE]: false,
	[SCROBBLE_PODCASTS]: true,
	[USE_NOTIFICATIONS]: true,
	[SCROBBLE_PERCENT]: 50,
	[DISABLED_CONNECTORS]: {},
	[USE_UNRECOGNIZED_SONG_NOTIFICATIONS]: false,
};

/**
 * Object that stores default option values for specific connectors.
 */
const defaultConnectorsOptions: ConnectorOptions = {
	Tidal: {
		useShortTrackNames: false,
	},
	YouTube: {
		scrobbleMusicOnly: false,
		scrobbleEntertainmentOnly: false,
	},
};

let options = defaultOptions;
let connectorsOptions = defaultConnectorsOptions;

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
	const optionsStorageData = (await optionsStorage.get()) as Options;
	options = Object.assign(options, optionsStorageData);
	await optionsStorage.set(options);
	optionsStorage.debugLog([DISABLED_CONNECTORS]);

	const connectorsOptionsData = (await connectorsOptionsStorage.get()) as ConnectorOptions;
	connectorsOptions = Object.assign(connectorsOptions, connectorsOptionsData);
	await connectorsOptionsStorage.set(connectorsOptions);
	connectorsOptionsStorage.debugLog();
}

async function cleanupConfigValues() {
	const data = (await optionsStorage.get()) as Options;

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

function getOption<T>(key: string): T {
	assertValidOptionKey(key);

	return options[key] as T;
}

function setOption<T>(key: string, value: T): void {
	assertValidOptionKey(key);

	options[key] = value;
	optionsStorage.set(options);
}

function getConnectorOption<T>(connector: string, key: string): T {
	assertValidConnectorOptionKey(connector, key);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	return connectorsOptions[connector][key] as T;
}

function setConnectorOption<T>(connector: string, key: string, value: T): void {
	assertValidConnectorOptionKey(connector, key);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	connectorsOptions[connector][key] = value;
	connectorsOptionsStorage.set(connectorsOptions);
}

/**
 * Check if connector is enabled.
 *
 * @param connector Connector
 *
 * @return Check result
 */
function isConnectorEnabled(connector: ConnectorEntry): boolean {
	return !options[DISABLED_CONNECTORS][connector.id] === true;
}

/**
 * Enable or disable connector.
 *
 * @param connector Connector
 * @param state True if connector is enabled; false otherwise
 */
function setConnectorEnabled(connector: ConnectorEntry, state: boolean): void {
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
 * @param state True if connector is enabled; false otherwise
 */
function setAllConnectorsEnabled(state: boolean): void {
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
 * @return List of connectors labels
 */
function getConnectorsList(): string[] {
	return Object.keys(defaultConnectorsOptions);
}

/**
 * Return a list of options for a given connector label.
 *
 * @param connectorLabel Connector label
 *
 * @return List of option keys
 */
function getConnectorOptions(connectorLabel: string): string[] {
	return Object.keys(defaultConnectorsOptions[connectorLabel]);
}

function assertValidOptionKey(key: string): void {
	if (!(key in defaultOptions)) {
		throw new Error(`Unknown option key: ${key}`);
	}
}

function assertValidConnectorOptionKey(connector: string, key: string): void {
	if (!(connector in defaultConnectorsOptions)) {
		throw new Error(`Unknown connector: ${connector}`);
	}

	if (!(key in defaultConnectorsOptions[connector])) {
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
