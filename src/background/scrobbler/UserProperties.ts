/**
 * Object that holds user properties.
 */
export interface UserProperties {
	/**
	 * Custom API URL.
	 */
	readonly apiUrl?: string;

	/**
	 * Custom API token. Can be used as a session ID.
	 */
	readonly token?: string;
}
