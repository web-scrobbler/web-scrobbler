export type OptionKey = keyof OptionsRepositoryData;

export interface DisabledConnectors {
	[connectorId: string]: boolean;
}

export interface OptionsRepositoryData {
	/**
	 * Object contains info of disabled connectors.
	 *
	 * Each key is a connector ID. If the connector is disabled,
	 * key value should be true. If connector is enabled, key should not exist.
	 */
	disabledConnectors: DisabledConnectors;

	/**
	 * Force song recognition.
	 */
	forceRecognize: boolean;

	/**
	 * Scrobble percent.
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
